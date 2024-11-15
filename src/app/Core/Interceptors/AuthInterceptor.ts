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

    const clonedRequest = this.addContentTypeHeader(req);

    var isAuthApi = this.shouldAddToken(req);
    if (!isAuthApi) {
      if (token && !exp) {
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
    if (token) {
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

// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, filter, take, switchMap } from 'rxjs/operators';
// import { AuthService } from '../Services/login.service';
// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   private isRefreshing = false;

//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(private authService: AuthService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let currentUser = this.authService.currentUserValue;
//     if (currentUser && currentUser.accessToken) {
//       request = this.addToken(request, currentUser.accessToken);
//     }

//     return next.handle(request).pipe(
//       catchError(error => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {
//           return this.handle401Error(request, next);
//         } else {
//           return throwError(error);
//         }
//       })
//     );
//   }

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((user: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(user.accessToken);
//           return next.handle(this.addToken(request, user.accessToken));
//         }),
//         catchError((err) => {
//           this.isRefreshing = false;
//           this.authService.logout();
//           return throwError(err);
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(accessToken => {
//           return next.handle(this.addToken(request, accessToken));
//         })
//       );
//     }
//   }
// }
