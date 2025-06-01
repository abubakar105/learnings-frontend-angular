import { Component } from '@angular/core';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
import { RouterModule } from '@angular/router';
import { AdminUsersComponent } from "../admin-users/admin-users.component";
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, RouterModule,  AdminNavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
