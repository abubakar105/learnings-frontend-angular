import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },

  {
    path: 'products',
    loadComponent: () =>
      import('./show-all-products/show-all-products.component').then(
        (m) => m.ShowAllProductsComponent
      ),
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import(
        './show-all-products/products-details/products-details.component'
      ).then((m) => m.ProductsDetailsComponent),
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout-details.component').then(
        (m) => m.CheckoutDetailsComponent
      ),
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },

  {
    path: '**',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];
