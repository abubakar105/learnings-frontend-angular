import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Guards/AuthorizeGuard';
import { HomeComponent } from './Fearure/Inner/home/home.component';
import { LoginComponent } from './Fearure/Auth/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
