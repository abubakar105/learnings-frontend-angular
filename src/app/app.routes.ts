import { Routes } from '@angular/router';
import { authRoutes } from './Fearure/Auth/auth.routes';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { AdminLayoutComponent } from './Fearure/Inner/Admin/admin-layout/admin-layout.component';
import { RoleGuard } from './Core/Guards/RoleGuard';
import { GuestGuard } from './Core/Guards/GuestGuard';
import { AuthGuard } from './Core/Guards/AuthorizeGuard';
import { azureAuthGuard } from './Core/Auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [GuestGuard]
  },
    {
    path: 'admin-login',
    loadComponent: () =>
      import('./Core/Auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'user',
    component: HomeComponent,
     canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Fearure/Inner/home/user-routes').then((m) => m.userRoutes),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [azureAuthGuard], // First check Azure AD authentication
    data: {
      allowedRoles: ['SuperAdmin', 'Admin'],
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./Fearure/Inner/Admin/admin-routes').then(
            (m) => m.adminRoutes
          ),
      },
    ],
  },
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: '**', redirectTo: '/user', pathMatch: 'full' },
];