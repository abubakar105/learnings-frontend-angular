// src/app/Core/Guards/guest.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.auth.getAccessToken();

    if (token && !this.auth.isAccessTokenExpired()) {
      // Already logged in — redirect to home
      this.router.navigate(['/user']);
      return false;
    }

    return true;
  }
}
