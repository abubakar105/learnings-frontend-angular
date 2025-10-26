import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../Core/Services/ToastService';
import { environment } from '../../../../../../enviornments/environment';

interface AzureUser {
  azureObjectId: string;
  email: string;
  name: string;
  roles: string[];
  selectedRole?: string;
}

@Component({
  selector: 'app-azure-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './azure-users-management.component.html',
})
export class AzureUsersManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  
  azureUsers: AzureUser[] = [];
  isLoading = false;
  availableRoles = ['Admin', 'SuperAdmin'];

  ngOnInit(): void {
    this.loadAzureUsers();
  }

  loadAzureUsers(): void {
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/AzureUser/all`).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.azureUsers = response.data.map((user: AzureUser) => ({
            ...user,
            selectedRole: user.roles[0] || 'Admin'
          }));
          this.toast.success('Users loaded successfully', 'Success');
        } else {
          this.toast.error(response.message, 'Failed');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load Azure users', 'Error');
        this.isLoading = false;
      }
    });
  }

  changeRole(user: AzureUser): void {
    if (!user.selectedRole) {
      this.toast.error('Please select a role', 'Error');
      return;
    }

    const confirmChange = confirm(
      `Are you sure you want to change ${user.email}'s role to ${user.selectedRole}?`
    );

    if (!confirmChange) {
      // Reset to original role
      user.selectedRole = user.roles[0];
      return;
    }

    this.http.post(`${environment.apiUrl}/AzureUser/change-role`, {
      azureObjectId: user.azureObjectId,
      roles: [user.selectedRole]
    }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.toast.success('Role updated successfully', 'Success');
          this.loadAzureUsers();
        } else {
          this.toast.error(response.message, 'Failed');
          user.selectedRole = user.roles[0];
        }
      },
      error: (error) => {
        this.toast.error(error.error?.message || 'Failed to update role', 'Error');
        user.selectedRole = user.roles[0];
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'SuperAdmin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}