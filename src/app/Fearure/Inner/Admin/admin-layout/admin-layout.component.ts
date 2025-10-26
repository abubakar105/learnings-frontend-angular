import { Component, inject, OnInit } from '@angular/core';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";
import { AzureAuthService } from '../../../../Core/Auth/services/auth.service';
import { AuthService } from '../../../../Core/Services/login.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, RouterModule, AdminNavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private azureAuthService = inject(AzureAuthService);

  ngOnInit(): void {
    const authType = this.authService.getAuthType();
    console.log('Auth type:', authType);

    if (authType === 'azure') {
      const cachedRoles = this.authService.getUserRoles();
      console.log('Cached roles:', cachedRoles);

      if (cachedRoles.length === 0) {
        this.authService.initializeAzureUser().subscribe({
          next: (roles) => console.log('User initialized with roles:', roles),
          error: (error) => console.error('Initialization failed:', error)
        });
      }
    }
  }
}