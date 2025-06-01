import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register-user/register-user.component').then(
        m => m.RegisterUserComponent
      ),
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./forget-password/forget-password.component').then(
        m => m.ForgetPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.component').then(
        m => m.ResetPasswordComponent
      ),
  },
  {
    path: 'check-your-email',
    loadComponent: () =>
      import('./check-your-email/check-your-email.component').then(
        m => m.CheckYourEmailComponent
      ),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
