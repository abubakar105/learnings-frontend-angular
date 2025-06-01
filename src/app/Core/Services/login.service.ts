// src/app/Core/Services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  throwError,
  filter,
  take,
  switchMap,
  tap,
  catchError
} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../enviornments/environment';

interface AuthResponse {
  accessToken: string;
  expires: string; // matches the backend JSON: { accessToken: "...", expires: "2025-06-01T11:33:11.6829602Z" }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl; // e.g. 'https://localhost:7195'
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenExpiryDate: Date | null = null;
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router) {
    // On service init, load any saved access token + expiry from localStorage (optional)
    const storedToken = localStorage.getItem('accessToken');
    const storedExpiry = localStorage.getItem('accessTokenExpiry');
    if (storedToken && storedExpiry) {
      this.accessTokenSubject.next(storedToken);
      this.tokenExpiryDate = new Date(storedExpiry);
    }
  }

  /**
   * Log in with { email, password }. Expects the server to:
   *  • set an HttpOnly "refreshToken" cookie
   *  • return JSON { accessToken, expires }
   */
  duplicateUserCheck(email:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/User/duplicateUser`,email)
  }
  RegisterUser(registerMode:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/User`,registerMode)
  }
  SendOTPEmail(email:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/User/forgetPassword`,email)
  }
  VerifyOtp(OtpCode:any,email:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/User/verifyOtp`,{email,OtpCode})
  }
  changePassword(resetPassword:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/User/ChangeForgetPassword`,resetPassword)
  }
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/User/login`,
        credentials,
        { withCredentials: true } // ensure the HttpOnly cookie is stored by the browser
      )
      .pipe(
        tap((res) => {
          this.storeAccessToken(res.accessToken, res.expires);
        })
      );
  }

  /** Store the access token in memory and optionally in localStorage */
  private storeAccessToken(jwt: string, expires: string) {
    this.accessTokenSubject.next(jwt);
    this.tokenExpiryDate = new Date(expires);
    localStorage.setItem('accessToken', jwt);
    localStorage.setItem('accessTokenExpiry', this.tokenExpiryDate.toISOString());
  }

  /** Returns the current access token or null */
  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  /** Returns true if no expiry is stored or if now > expiry */
  isAccessTokenExpired(): boolean {
    if (!this.tokenExpiryDate) {
      return true;
    }
    return new Date() > this.tokenExpiryDate;
  }

  /**
   * Call /api/User/refresh-token with withCredentials so the browser
   * automatically sends the HttpOnly refresh cookie. On success, store
   * the new access token and return it. On failure, logout.
   */
  refreshAccessToken(): Observable<string> {
    if (this.isRefreshing) {
      // If a refresh is already in progress, wait for it to finish
      return this.accessTokenSubject
        .asObservable()
        .pipe(
          filter((tk): tk is string => tk !== null),
          take(1)
        );
    }

    this.isRefreshing = true;
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/User/refresh-token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          this.storeAccessToken(res.accessToken, res.expires);
          this.isRefreshing = false;
        }),
        switchMap((res) => of(res.accessToken)),
        catchError((err) => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => err);
        })
      );
  }

  /** Clear everything and navigate to /login */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiry');
    this.accessTokenSubject.next(null);
    this.router.navigate(['/login']);
  }
  getUserRoles(): string[] {
    const token = this.getAccessToken();
    if (!token) return [];

    // JWT format: header.payload.signature (all Base64URL)
    const parts = token.split('.');
    if (parts.length !== 3) return [];

    try {
      // atob is Base64 (not Base64URL) so we replace URL chars
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      // Decode base64 → string
      const json = JSON.parse(atob(payload));
      // .NET often uses "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      const roleClaim = json['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (!roleClaim) return [];

      // The claim might be a string or an array of strings:
      if (Array.isArray(roleClaim)) {
        return roleClaim as string[];
      } else if (typeof roleClaim === 'string') {
        return [roleClaim];
      }
    } catch {
      return [];
    }
    return [];
  }

  /** Returns true if the user has at least one of the specified roles */
  hasAnyRole(...needed: string[]): boolean {
    const roles = this.getUserRoles();
    return roles.some(r => needed.includes(r));
  }

  /** Returns true if the user has all of the specified roles */
  hasAllRoles(...needed: string[]): boolean {
    const roles = this.getUserRoles();
    return needed.every(r => roles.includes(r));
  }
}
