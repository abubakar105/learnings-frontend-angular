import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Services/login.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('https://api.cloudinary.com/v1_1/')) {
      return next.handle(req);
    }

    const isFormData = req.body instanceof FormData;
    let jsonReq = req;
    if (!isFormData) {
      jsonReq = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    } else {
      const headers = req.headers.delete('Content-Type');
      jsonReq = req.clone({ headers });
    }

    if (this.isAuthEndpoint(jsonReq.url)) {
      return next.handle(jsonReq.clone({ withCredentials: true }));
    }

    // Get token
    const token = this.authService.getAccessToken();
    const expired = this.authService.isAccessTokenExpired();

    let reqWithToken: HttpRequest<any>;
    if (token && !expired) {
      reqWithToken = jsonReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } else {
      reqWithToken = jsonReq.clone({ withCredentials: true });
    }

    return next.handle(reqWithToken).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.isAuthEndpoint(jsonReq.url)) {
          return this.authService.refreshAccessToken().pipe(
            switchMap((newToken) => {
              const retryReq = jsonReq.clone({
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
      url.includes('/User/login') ||
      url.includes('/User/register') ||
      url.includes('/User/refresh-token') ||
      url.includes('/User/forgetPassword') ||
      url.includes('/User/ChangeForgetPassword') ||
      url.includes('/AzureUser/initialize') ||
      url.includes('/AzureUser/my-roles')
    );
  }
}