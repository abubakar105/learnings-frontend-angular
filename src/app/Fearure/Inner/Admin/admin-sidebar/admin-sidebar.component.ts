import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../Core/Services/login.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  constructor(public authService: AuthService) {}

}
