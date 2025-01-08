import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/login.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired()) {
      return this.authService.refreshToken().pipe(
        switchMap((newToken) => {
          if (newToken) {
            // If token refresh is successful, allow access to the route
            return [true];
          } else {
            // If refresh fails, redirect to login
            this.router.navigate(['/login']);
            return [false];
          }
        }),
        catchError(() => {
          // Handle error if refreshing the token fails
          this.router.navigate(['/login']);
          return [false];
        })
      );
    }

    // If token is valid, allow access
    return of(true);
  }
}
