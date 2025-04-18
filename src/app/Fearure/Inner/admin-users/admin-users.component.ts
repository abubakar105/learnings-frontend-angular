import { CommonModule } from '@angular/common';
import { Component, OnInit, VERSION } from '@angular/core';
import { DropdownDirective } from '../../../Shared/CustomDirective/DropDownDirective';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminUsers } from '../../../Core/Services/AdminUsersService';
import { ToastService } from '../../../Core/Services/ToastService';
import { AdminAddUserComponent } from "../admin-add-user/admin-add-user.component";

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, DropdownDirective, AdminAddUserComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  adminsData: any[] = [];
  adminRolesOpenMap: Map<number, boolean> = new Map();
  showAddUserModal = false;

  constructor(
    private http: HttpClient,
    private adminUsers: AdminUsers,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.fetchAdminsData();
  }
  
  adminRolesOpen = false;
  filterRolesOpen = false;
  closeFilterDropDown() {
    this.filterRolesOpen = false;
  }
  closeFilterOnClick() {
    this.filterRolesOpen = false;
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }
  toggleAdminRolesDropdown(index: number): void {
    this.adminRolesOpenMap.set(index, !this.adminRolesOpenMap.get(index));
  }

  closeAdminDropDown(index: number): void {
    this.adminRolesOpenMap.set(index, false);
  }

  fetchAdminsData(): void {
    this.adminUsers.getAllAdmins().subscribe(
      (response) => {
        if (response.status !== 200) {
          this.toastService.error('Cannot find admins!', 'Failed');
        }
        this.adminsData = response.data;
        console.log(this.adminsData);
      },
      (error) => {
        this.toastService.error('Failed find admins!', 'Failed');
      }
    );
  }
}
