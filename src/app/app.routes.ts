import { Routes } from '@angular/router';
import { authRoutes } from './Fearure/Auth/auth.routes';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { AdminLayoutComponent } from './Fearure/Inner/Admin/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
{
    path: 'user',
    component: HomeComponent,
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
    children: [
      // Instead of loading authRoutes, we load adminRoutes
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