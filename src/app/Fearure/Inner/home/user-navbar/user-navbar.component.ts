import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../Core/Services/login.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent {
 dropdownOpen = false;

   constructor(private authService: AuthService, private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  signOut() {
    this.authService.logout();
    this.router.navigate(['/auth/login']); 
  }
}
