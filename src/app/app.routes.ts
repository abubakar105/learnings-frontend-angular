import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Guards/AuthorizeGuard';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { LoginComponent } from './Fearure/Auth/login/login.component';
import { RegisterUserComponent } from './Fearure/Auth/register-user/register-user.component';
import { LoginGuard } from './Core/Guards/LoginGuard';
import { ForgetPasswordComponent } from './Fearure/Auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './Fearure/Auth/reset-password/reset-password.component';
import { CheckYourEmailComponent } from './Fearure/Auth/check-your-email/check-your-email.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect home with AuthGuard
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }, // Prevent logged-in users from accessing login
  { path: 'register', component: RegisterUserComponent, canActivate: [LoginGuard] },
  { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [LoginGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoginGuard] },
  { path: 'check-your-email', component: CheckYourEmailComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
