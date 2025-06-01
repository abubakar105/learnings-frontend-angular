// src/app/Core/Guards/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../Services/login.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // The route configuration will pass an array of roles in data.allowedRoles
    const allowedRoles: string[] = route.data['allowedRoles'] || [];
    const token = this.auth.getAccessToken();

    // 1. If no token or token expired, redirect to login
    if (!token || this.auth.isAccessTokenExpired()) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Check if user has at least one of the allowed roles
    if (allowedRoles.length > 0 && this.auth.hasAnyRole(...allowedRoles)) {
      return true;
    }

    // 3. Otherwise, not authorized—navigate somewhere else (e.g. "Access Denied" or home)
    this.router.navigate(['/access-denied']);
    return false;
  }
}
