import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // /admin/dashboard
      {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },

  // /admin/users
  {
    path: 'users-management',
    loadComponent: () =>
      import('./admin-users/admin-users.component').then(
        (m) => m.AdminUsersComponent
      ),
  },
{
    path: 'azure-users-management',
    loadComponent: () =>
      import('./admin-add-role/azure-users-management/azure-users-management.component').then(
        (m) => m.AzureUsersManagementComponent
      ),
  },
  // /admin/role-management
  {
    path: 'role-management',
    loadComponent: () =>
      import('./admin-roles/admin-roles.component').then(
        (m) => m.AdminRolesComponent
      ),
  },

  // /admin/products
  {
    path: 'products-management',
    loadComponent: () =>
      import('./Products/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },

  // Any unknown /admin/... → redirect back to /admin/dashboard
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
