import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Guards/AuthorizeGuard';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { LoginComponent } from './Fearure/Auth/login/login.component';
import { RegisterUserComponent } from './Fearure/Auth/register-user/register-user.component';
import { LoginGuard } from './Core/Guards/LoginGuard';
import { ForgetPasswordComponent } from './Fearure/Auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Fearure/Auth/reset-password/reset-password.component';
import { CheckYourEmailComponent } from './Fearure/Auth/check-your-email/check-your-email.component';
import { AdminLayoutComponent } from './Fearure/Inner/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './Fearure/Inner/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './Fearure/Inner/admin-users/admin-users.component';
import { AdminAddUserComponent } from './Fearure/Inner/admin-add-user/admin-add-user.component';
import { AdminRolesComponent } from './Fearure/Inner/admin-roles/admin-roles.component';
import { AddProductComponent } from './Fearure/Inner/Products/add-product/add-product.component';
import { ShowAllProductsComponent } from './Fearure/Inner/User/show-all-products/show-all-products.component';
import { ProductsDetailsComponent } from './Fearure/Inner/User/show-all-products/products-details/products-details.component';
import { CheckoutDetailsComponent } from './Fearure/Inner/User/checkout/checkout-details.component';
import { UserProfileComponent } from './Fearure/Inner/User/profile/user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'products', component: ShowAllProductsComponent },
      { path: 'products/:id', component: ProductsDetailsComponent },
      {
        path: 'checkout',
        component: CheckoutDetailsComponent,
        // canActivate: [LoginGuard],
      },
      {
    path: 'user/profile',
    component: UserProfileComponent,
    //  canActivate: [LoginGuard]
  },
    ],
  },
  

  {
    path: 'login',
    component: LoginComponent,
    //  canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterUserComponent,
    // canActivate: [LoginGuard],
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    // canActivate: [LoginGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    // canActivate: [LoginGuard],
  },
  {
    path: 'check-your-email',
    component: CheckYourEmailComponent,
    // canActivate: [LoginGuard],
  },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayoutComponent, // Wraps Sidebar & Content
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'role-managemnt', component: AdminRolesComponent },
      { path: 'products', component: AddProductComponent },
      // { path: 'add-user', component: AdminAddUserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
