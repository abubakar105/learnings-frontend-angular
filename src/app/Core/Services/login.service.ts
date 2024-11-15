// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  tokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('https://localhost:7195/api/User/login', credentials).pipe(
      tap((res) => {
        this.storeTokens(res);  
      })
    );
  }

  private storeTokens(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('tokenExpiry', res.expiration);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('refreshTokenExpiry', res.refreshTokenExpiration);

    this.tokenSubject.next(res.token);
    this.refreshTokenSubject.next(res.refreshToken);
  }

  getToken() {
    return this.tokenSubject.value || localStorage.getItem('token');
  }

  getRefreshToken() {
    return this.refreshTokenSubject.value || localStorage.getItem('refreshToken');
  }

  isTokenExpired(): boolean {
    const expiry = new Date(localStorage.getItem('tokenExpiry') || '');
    return new Date() > expiry;
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token not found'));
    }

    if (this.isRefreshing) {
      // Prevent multiple refresh token requests
      return this.tokenSubject.asObservable().pipe(
        filter((token): token is string => token !== null) // Ensure only non-null values are emitted
      );
    }

    this.isRefreshing = true;

    return this.http
      .post<any>(
        'https://localhost:7195/api/User/refresh-token',
        { refreshToken },
      )
      .pipe(
        switchMap((response) => {
          localStorage.clear();

          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenExpiry', response.expiration);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem(
            'refreshTokenExpiry',
            response.refreshTokenExpiration
          );
          this.tokenSubject.next(response.token);
          this.isRefreshing = false;
          return of(response.token);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          localStorage.clear();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
  }

  logout() {
    localStorage.clear();
    this.tokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.router.navigate(['/login']);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map, catchError, switchMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private authUrl = 'https://localhost:7195/api/User';
//   private currentUserSubject: BehaviorSubject<any>;
//   public currentUser: Observable<any>;


//   constructor(private http: HttpClient) {
//     const storedUser = localStorage.getItem('currentUser');
//     this.currentUserSubject = new BehaviorSubject<any>(
//       storedUser ? JSON.parse(storedUser) : null
//     );
//     this.currentUser = this.currentUserSubject.asObservable();
//   }


//   public get currentUserValue() {
//     return this.currentUserSubject.value;
//   }


//   login(username: any) {
//     return this.http.post<any>(`${this.authUrl}/login`,  username )
//       .pipe(
//         map((user) => 
//       {
//           if (user && user.accessToken && user.refreshToken) {
//             localStorage.setItem('currentUser', JSON.stringify(user));
//             this.currentUserSubject.next(user);
//           }
//           return user;
//         })
//       );
//   }



//   logout() {
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }



//   refreshToken() {
//     return this.http.post<any>(`${this.authUrl}/refresh-token`, {
//       refreshToken: this.currentUserValue.refreshToken
//     }).pipe(
//       map((user) => {
//         if (user && user.accessToken) {
//           const currentUser = this.currentUserValue;
//           currentUser.accessToken = user.accessToken;
//           localStorage.setItem('currentUser', JSON.stringify(currentUser));
//           this.currentUserSubject.next(currentUser);
//         }
//         return user;
//       }),
//       catchError((error) => {
//         this.logout();
//         throw error;
//       })
//     );
//   }
// }