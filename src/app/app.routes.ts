import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Guards/AuthorizeGuard';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { LoginComponent } from './Fearure/Auth/login/login.component';
import { RegisterUserComponent } from './Fearure/Auth/register-user/register-user.component';
import { LoginGuard } from './Core/Guards/LoginGuard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard]  },
  { path: 'register', component: RegisterUserComponent, canActivate: [LoginGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
