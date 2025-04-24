import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminUsers } from '../../../Core/Services/AdminUsersService';
import { ToastService } from '../../../Core/Services/ToastService';
import { RolesService } from '../../../Core/Services/RolesService';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from '../../../Shared/CustomDirective/DropDownDirective';
import { AdminAddRoleComponent } from "../admin-add-role/admin-add-role.component";

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, DropdownDirective, AdminAddRoleComponent,AdminAddRoleComponent],
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.css']
})
export class AdminRolesComponent implements OnInit {
  rolesData : any[] = [];
  rolesPermissionsOpenMap: Map<number, boolean> = new Map();
  openAddRoleComponent = false;
  openUpdateRoleModal = false;
constructor(
    private http: HttpClient,
    private roleService: RolesService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.fetchAdminsData();
  }
  toggleRolePermissionsDropdown(index: number): void {
    this.rolesPermissionsOpenMap.set(index, !this.rolesPermissionsOpenMap.get(index));
  }

  closeRolePermissionsDropDown(index: number): void {
    this.rolesPermissionsOpenMap.set(index, false);
  }

  openAddRoleModal(){
    this.openAddRoleComponent = true;
  }
  closeAddRoleModal(){
    this.openAddRoleComponent = false;
  }
  fetchAdminsData(): void {
    this.roleService.getAllRoles().subscribe(
      (response) => {
        if (response.status == 200) {
          this.rolesData = response.data;
        console.log(this.rolesData);
      }
      else{
        this.toastService.error(response.message, 'Failed');
      }
      },
      (error) => {
        this.toastService.error('Failed find roles!', 'Failed');
      }
    );
  }
}
