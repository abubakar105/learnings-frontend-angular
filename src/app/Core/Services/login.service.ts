import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, filter, take, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../enviornments/environment';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

interface AzureUserResponse {
  data: {
    userId: string;
    email: string;
    name: string;
    roles: string[];
    isNewUser: boolean;
  };
  message: string;
  statusCode: number;
}

interface RolesResponse {
  data: {
    roles: string[];
  };
  message: string;
  statusCode: number;
}

interface AuthResponse {
  accessToken: string;
  expires: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private msalService = inject(MsalService);
  private router = inject(Router);
  
  private rolesSubject = new BehaviorSubject<string[]>([]);
  public roles$ = this.rolesSubject.asObservable();
  private tokenExpiryDate: Date | null = null;
  private isRefreshing = false;
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private baseUrl = environment.apiUrl;

  duplicateUserCheck(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User/duplicateUser`, email);
  }

  RegisterUser(registerMode: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User`, registerMode);
  }

  SendOTPEmail(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User/forgetPassword`, email);
  }

  VerifyOtp(OtpCode: any, email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User/verifyOtp`, { email, OtpCode });
  }

  changePassword(resetPassword: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/User/ChangeForgetPassword`, resetPassword);
  }

  getAuthType(): 'custom' | 'azure' | null {
    const azureAccount = this.msalService.instance.getActiveAccount();
    if (azureAccount) return 'azure';
    
    const customToken = localStorage.getItem('accessToken');
    if (customToken) return 'custom';
    
    return null;
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/User/login`, credentials, { withCredentials: true })
      .pipe(tap((res) => this.storeAccessToken(res.accessToken, res.expires)));
  }

  initializeAzureUser(): Observable<string[]> {
    console.log('initializeAzureUser called');

    return this.getAzureAccessTokenFromMsal().pipe(
      switchMap((azureToken) => {
        console.log('Got Azure token from MSAL');
        console.log('Calling:', `${this.baseUrl}/AzureUser/initialize`);

        // Add Authorization header with Azure token
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${azureToken}`,
          'Content-Type': 'application/json'
        });

        return this.http.post<AzureUserResponse>(
          `${this.baseUrl}/AzureUser/initialize`,
          {},
          { headers } 
        ).pipe(
          tap(response => {
            console.log('Backend response:', response);
          }),
          map(response => {
            const roles = response.data.roles;
            console.log('User initialized with roles:', roles);
            
            this.rolesSubject.next(roles);
            localStorage.setItem('azure_roles', JSON.stringify(roles));
            localStorage.setItem('azure_token', azureToken); // Store Azure token
            
            return roles;
          }),
          catchError(error => {
            console.error('Failed to initialize Azure user:', error);
            console.error('Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              url: error.url,
              error: error.error
            });
            
            // Return default role on error
            const defaultRoles = ['Admin'];
            this.rolesSubject.next(defaultRoles);
            localStorage.setItem('azure_roles', JSON.stringify(defaultRoles));
            return of(defaultRoles);
          })
        );
      }),
      catchError(error => {
        console.error('Failed to get Azure token:', error);
        return throwError(() => error);
      })
    );
  }

  private getAzureAccessTokenFromMsal(): Observable<string> {
    return new Observable(observer => {
      const account = this.msalService.instance.getActiveAccount();
      
      if (!account) {
        console.error('No active Azure account');
        observer.error('No active account');
        return;
      }

      console.log('Active Azure account:', account.username);

      this.msalService.acquireTokenSilent({
        scopes: environment.azureAd.scopes,
        account: account
      }).subscribe({
        next: (result) => {
          console.log('Azure token acquired successfully');
          observer.next(result.accessToken);
          observer.complete();
        },
        error: (error) => {
          console.error('Token acquisition failed:', error);
          observer.error(error);
        }
      });
    });
  }

  getUserRoles(): string[] {
    const authType = this.getAuthType();
    if (authType === 'custom') return this.getRolesFromCustomToken();
    if (authType === 'azure') return this.getRolesFromLocalStorage();
    return [];
  }

  private getRolesFromCustomToken(): string[] {
    const token = localStorage.getItem('accessToken');
    if (!token) return [];

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return [];
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = JSON.parse(atob(payload));
      const roleClaim = json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      
      if (Array.isArray(roleClaim)) return roleClaim;
      if (typeof roleClaim === 'string') return [roleClaim];
    } catch {}
    return [];
  }

  private getRolesFromLocalStorage(): string[] {
    try {
      const rolesJson = localStorage.getItem('azure_roles');
      if (rolesJson) return JSON.parse(rolesJson);
    } catch {}
    return [];
  }

  refreshAzureRoles(): Observable<string[]> {
    return this.getAzureAccessTokenFromMsal().pipe(
      switchMap((azureToken) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${azureToken}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<RolesResponse>(
          `${this.baseUrl}/AzureUser/my-roles`,
          { headers }
        ).pipe(
          map(response => {
            const roles = response.data.roles;
            this.rolesSubject.next(roles);
            localStorage.setItem('azure_roles', JSON.stringify(roles));
            return roles;
          }),
          catchError(error => {
            console.error('Failed to refresh roles:', error);
            return of(this.getRolesFromLocalStorage());
          })
        );
      })
    );
  }

  private storeAccessToken(jwt: string, expires: string) {
    this.accessTokenSubject.next(jwt);
    this.tokenExpiryDate = new Date(expires);
    localStorage.setItem('accessToken', jwt);
    localStorage.setItem('accessTokenExpiry', this.tokenExpiryDate.toISOString());
  }

  logout(): void {
    const authType = this.getAuthType();
    
    if (authType === 'azure') {
      // Azure logout
      this.msalService.logoutRedirect({
        postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri || 'http://localhost:4200'
      });
      localStorage.removeItem('azure_roles');
      localStorage.removeItem('azure_token');
    } else {
      // Custom auth logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiry');
      this.router.navigate(['/auth/login']);
    }
    
    this.accessTokenSubject.next(null);
    this.rolesSubject.next([]);
  }

  hasAnyRole(...needed: string[]): boolean {
    const roles = this.getUserRoles();
    return roles.some(r => needed.includes(r));
  }

  isAuthenticated(): boolean {
    return this.getAuthType() !== null;
  }

  getAccessToken(): string | null {
    const authType = this.getAuthType();
    if (authType === 'custom') return localStorage.getItem('accessToken');
    if (authType === 'azure') return localStorage.getItem('azure_token'); // 👈 Use stored Azure token
    return null;
  }

  isAccessTokenExpired(): boolean {
    if (!this.tokenExpiryDate) return true;
    return new Date() > this.tokenExpiryDate;
  }

  refreshAccessToken(): Observable<string> {
    const authType = this.getAuthType();
    
    // Azure tokens are refreshed by MSAL automatically
    if (authType === 'azure') {
      return this.getAzureAccessTokenFromMsal();
    }

    // Custom token refresh
    if (this.isRefreshing) {
      return this.accessTokenSubject.asObservable().pipe(
        filter((tk): tk is string => tk !== null),
        take(1)
      );
    }

    this.isRefreshing = true;
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/User/refresh-token`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => {
        this.accessTokenSubject.next(res.accessToken);
        this.tokenExpiryDate = new Date(res.expires);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('accessTokenExpiry', this.tokenExpiryDate.toISOString());
        this.isRefreshing = false;
      }),
      switchMap(res => of(res.accessToken)),
      catchError(err => {
        this.isRefreshing = false;
        return throwError(() => err);
      })
    );
  }

  clearAzureRoles(): void {
    localStorage.removeItem('azure_roles');
    localStorage.removeItem('azure_token');
    this.rolesSubject.next([]);
  }
}
// // src/app/Core/Services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import {
//   BehaviorSubject,
//   Observable,
//   of,
//   throwError,
//   filter,
//   take,
//   switchMap,
//   tap,
//   catchError
// } from 'rxjs';
// import { Router } from '@angular/router';
// import { environment } from '../../../enviornments/environment';

interface AuthResponse {
  accessToken: string;
  expires: string; // matches the backend JSON: { accessToken: "...", expires: "2025-06-01T11:33:11.6829602Z" }
}

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private baseUrl = environment.apiUrl; // e.g. 'https://localhost:7195'
//   private accessTokenSubject = new BehaviorSubject<string | null>(null);
//   private tokenExpiryDate: Date | null = null;
//   private isRefreshing = false;

//   constructor(private http: HttpClient, private router: Router) {
//     // On service init, load any saved access token + expiry from localStorage (optional)
//     const storedToken = localStorage.getItem('accessToken');
//     const storedExpiry = localStorage.getItem('accessTokenExpiry');
//     if (storedToken && storedExpiry) {
//       this.accessTokenSubject.next(storedToken);
//       this.tokenExpiryDate = new Date(storedExpiry);
//     }
//   }

//   /**
//    * Log in with { email, password }. Expects the server to:
//    *  • set an HttpOnly "refreshToken" cookie
//    *  • return JSON { accessToken, expires }
//    */
//   duplicateUserCheck(email:any):Observable<any>{
//     return this.http.post<any>(`${this.baseUrl}/User/duplicateUser`,email)
//   }
//   RegisterUser(registerMode:any):Observable<any>{
//     return this.http.post<any>(`${this.baseUrl}/User`,registerMode)
//   }
//   SendOTPEmail(email:any):Observable<any>{
//     return this.http.post<any>(`${this.baseUrl}/User/forgetPassword`,email)
//   }
//   VerifyOtp(OtpCode:any,email:any):Observable<any>{
//     return this.http.post<any>(`${this.baseUrl}/User/verifyOtp`,{email,OtpCode})
//   }
//   changePassword(resetPassword:any):Observable<any>{
//     return this.http.post<any>(`${this.baseUrl}/User/ChangeForgetPassword`,resetPassword)
//   }
//   login(credentials: { email: string; password: string }): Observable<AuthResponse> {
//     return this.http
//       .post<AuthResponse>(
//         `${this.baseUrl}/User/login`,
//         credentials,
//         { withCredentials: true } // ensure the HttpOnly cookie is stored by the browser
//       )
//       .pipe(
//         tap((res) => {
//           this.storeAccessToken(res.accessToken, res.expires);
//         })
//       );
//   }

//   /** Store the access token in memory and optionally in localStorage */
//   private storeAccessToken(jwt: string, expires: string) {
//     this.accessTokenSubject.next(jwt);
//     this.tokenExpiryDate = new Date(expires);
//     localStorage.setItem('accessToken', jwt);
//     localStorage.setItem('accessTokenExpiry', this.tokenExpiryDate.toISOString());
//   }

//   /** Returns the current access token or null */
//   getAccessToken(): string | null {
//     return this.accessTokenSubject.value;
//   }

//   /** Returns true if no expiry is stored or if now > expiry */
//   isAccessTokenExpired(): boolean {
//     if (!this.tokenExpiryDate) {
//       return true;
//     }
//     return new Date() > this.tokenExpiryDate;
//   }

//   /**
//    * Call /api/User/refresh-token with withCredentials so the browser
//    * automatically sends the HttpOnly refresh cookie. On success, store
//    * the new access token and return it. On failure, logout.
//    */
//   refreshAccessToken(): Observable<string> {
//     if (this.isRefreshing) {
//       // If a refresh is already in progress, wait for it to finish
//       return this.accessTokenSubject
//         .asObservable()
//         .pipe(
//           filter((tk): tk is string => tk !== null),
//           take(1)
//         );
//     }

//     this.isRefreshing = true;
//     return this.http
//       .post<AuthResponse>(
//         `${this.baseUrl}/User/refresh-token`,
//         {},
//         { withCredentials: true }
//       )
//       .pipe(
//         tap((res) => {
//           this.storeAccessToken(res.accessToken, res.expires);
//           this.isRefreshing = false;
//         }),
//         switchMap((res) => of(res.accessToken)),
//         catchError((err) => {
//           this.isRefreshing = false;
//           this.logout();
//           return throwError(() => err);
//         })
//       );
//   }

//   /** Clear everything and navigate to /login */
//   logout(): void {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('accessTokenExpiry');
//     this.accessTokenSubject.next(null);
//     this.router.navigate(['/login']);
//   }
//   getUserRoles(): string[] {
//     const token = this.getAccessToken();
//     if (!token) return [];

//     // JWT format: header.payload.signature (all Base64URL)
//     const parts = token.split('.');
//     if (parts.length !== 3) return [];

//     try {
//       // atob is Base64 (not Base64URL) so we replace URL chars
//       const payload = parts[1]
//         .replace(/-/g, '+')
//         .replace(/_/g, '/');
//       // Decode base64 → string
//       const json = JSON.parse(atob(payload));
//       // .NET often uses "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//       const roleClaim = json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//       if (!roleClaim) return [];

//       // The claim might be a string or an array of strings:
//       if (Array.isArray(roleClaim)) {
//         return roleClaim as string[];
//       } else if (typeof roleClaim === 'string') {
//         return [roleClaim];
//       }
//     } catch {
//       return [];
//     }
//     return [];
//   }

//   /** Returns true if the user has at least one of the specified roles */
//   hasAnyRole(...needed: string[]): boolean {
//     const roles = this.getUserRoles();
//     return roles.some(r => needed.includes(r));
//   }

//   /** Returns true if the user has all of the specified roles */
//   hasAllRoles(...needed: string[]): boolean {
//     const roles = this.getUserRoles();
//     return needed.every(r => roles.includes(r));
//   }
// }
