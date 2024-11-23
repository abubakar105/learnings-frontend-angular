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
    const expToken = this.authService.isTokenExpired();

    if (!token) {
      this.router.navigate(['/login']);
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
