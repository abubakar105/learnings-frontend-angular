import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const exp = this.authService.isTokenExpired();
//debugger
    const clonedRequest = this.addContentTypeHeader(req);

    var isAuthApi = this.shouldAddToken(req);
    if (!isAuthApi) {
      // if (token && !exp) {
        if (!token || exp) {
        const requestWithToken = this.addToken(clonedRequest, token);
        return next.handle(requestWithToken);
      } else if (token && exp) {
        return this.authService.refreshToken().pipe(
          switchMap((newToken) => {
            const newRequest = this.addToken(clonedRequest, newToken);
            return next.handle(newRequest);
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(clonedRequest);
  }

  private shouldAddToken(req: HttpRequest<any>): boolean {
    const excludedUrls = [
      '/api/User/login',
      '/api/User/register',
      '/api/User/refresh-token',
    ];
    return excludedUrls.some((url) => req.url.includes(url));
  }

  private addToken(
    req: HttpRequest<any>,
    token: string | null
  ): HttpRequest<any> {
    if (!token) {
      // if (token) {
      token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWE3ZjAzNy01MzEzLTQyNTktYjJhZi1iYjRiMDUwZjdkNzYiLCJlbWFpbCI6ImFidWJha2FyLjU5MTMyQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3NDgxNjU5NzMsImV4cCI6MTc0ODE3Nzk3MywiaXNzIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20ifQ.e1Gqb6jwIPprefb2Lom5QawHDxeSt0rusKZ-k4vMRts';
      return req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return req;
  }

  private addContentTypeHeader(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
    });
  }
}
