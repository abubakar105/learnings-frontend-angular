import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('Unauthorized request - redirecting to login');
        
        const authType = localStorage.getItem('auth_type');
        if (authType === 'azure') {
          router.navigate(['/admin-login']);
        } else {
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};