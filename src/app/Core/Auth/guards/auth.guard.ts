import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../../Services/login.service';

export const azureAuthGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const authService = inject(AuthService);
  const router = inject(Router);


  const account = msalService.instance.getActiveAccount();
  
  if (!account) {
    router.navigate(['/admin-login']);
    return false;
  }

  console.log('Active Azure account found:', account.username);

  const cachedRoles = localStorage.getItem('azure_roles');
  
  if (cachedRoles) {
    const roles = JSON.parse(cachedRoles);
    console.log('Using cached roles:', roles);

    const allowedRoles = route.data?.['allowedRoles'] as string[] || [];
    if (allowedRoles.length > 0) {
      const hasRole = allowedRoles.some(role => roles.includes(role));
      if (!hasRole) {
        console.log('User does not have required roles');
        router.navigate(['/admin-login']);
        return false;
      }
    }
    
    return true;
  }

  console.log('No cached roles, redirecting to login to initialize');
  router.navigate(['/admin-login']);
  return false;
};