// src/app/Core/Interceptors/token.interceptor.ts
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. Add Content-Type header
    const jsonReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
    });

    // 2. Check if this is an auth endpoint (login, register, or refresh)
    if (this.isAuthEndpoint(jsonReq.url)) {
      // Always send credentials (cookie) for login/refresh/register
      const passThrough = jsonReq.clone({ withCredentials: true });
      return next.handle(passThrough);
    }

    // 3. For any other request, attach the access token if valid
    const token = this.authService.getAccessToken();
    const expired = this.authService.isAccessTokenExpired();

    let reqWithToken: HttpRequest<any>;
    if (token && !expired) {
      reqWithToken = jsonReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true, // send cookie on every request
      });
    } else {
      // No valid token: send request anyway with credentials so we can refresh on 401
      reqWithToken = jsonReq.clone({ withCredentials: true });
    }

    // 4. Handle response; on 401, try to refresh once
    return next.handle(reqWithToken).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === 401 &&
          !this.isAuthEndpoint(jsonReq.url)
        ) {
          // Attempt to refresh
          return this.authService.refreshAccessToken().pipe(
            switchMap((newToken) => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
                withCredentials: true,
              });
              return next.handle(retryReq);
            }),
            catchError((refreshErr) => {
              this.authService.logout();
              return throwError(() => refreshErr);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes('/api/User/login') ||
      url.includes('/api/User/register') ||
      url.includes('/api/User/refresh-token') ||
      url.includes('/api/User/forgot-password') ||
      url.includes('/api/User/reset-password')
    );
  }
}
