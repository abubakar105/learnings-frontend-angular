import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const isTokenExpired = this.authService.isTokenExpired();

    if (token && !isTokenExpired) {
      // If the user is already logged in, redirect them to home
      this.router.navigate(['/home']);
      return false;
    }
    // If not logged in, allow access to the route
    return true;
  }
}
