import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownDirective } from '../../../../Shared/CustomDirective/DropDownDirective';
import { MultiSelectComponent } from '../../home/multi-select/multi-select.component';
import { AdminUsers } from '../../../../Core/Services/AdminUsersService';
import { HttpClient } from '@angular/common/http';
import { RolesService } from '../../../../Core/Services/RolesService';
import { ToastService } from '../../../../Core/Services/ToastService';

@Component({
  selector: 'app-admin-update-roles',
  standalone: true,
  imports: [DropdownDirective, CommonModule, MultiSelectComponent],
  templateUrl: './admin-update-roles.component.html',
  styleUrls: ['./admin-update-roles.component.css'],
})
export class AdminUpdateRolesComponent implements OnInit {
  @Input() selectedAdmin: any = null;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() fetchUpdatedAdmins = new EventEmitter<void>();
  adminRolesOpen: boolean = false;
  notassignedRoles: any[] = [];
  selectedNewRoles: any[] = [];

  constructor(
    private http: HttpClient,
    private adminUsers: AdminUsers,
    private rolesService: RolesService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    console.log('first');
    console.log(this.selectedAdmin);
    this.getAllNotAssignedRole();
  }
  getAllNotAssignedRole(){
    this.rolesService.getAllNotAssignedRoles(this.selectedAdmin?.id).subscribe(
      (response) => {
        if (response.status == 200) {
          this.notassignedRoles = response.data;
        } else {
          this.toastService.error(response.message, 'Failed');
        }
      },
      (error) => {
        this.toastService.error('Failed find roles!', 'Failed');
      }
    );
  }
  onRolesChange(event: number[]) {
    this.selectedNewRoles = event;
    console.log(this.selectedAdmin)
  }

  toggleAdminRolesDropdown(): void {
    this.adminRolesOpen = !this.adminRolesOpen;
  }
  closeAdminDropDown(): void {
    this.adminRolesOpen = false;
  }
  deleteRoleFromAdmin(role:any){
    console.log(role)
    const roleDeleteId =this.selectedAdmin.roles.indexOf(role);

    const payload = {
      id: this.selectedAdmin.id,
      firstName: this.selectedAdmin.firstName,
      lastName: this.selectedAdmin.lastName,
      phoneNumber: this.selectedAdmin.phoneNumber,
      email: this.selectedAdmin.email,
      roleId: [this.selectedAdmin.rolesId[roleDeleteId]]
    };
    
    this.rolesService.DeleteRolesFromAdmin(payload).subscribe(
      (response) => {
        if (response.status == 200) {
          this.toastService.success(response.message, 'Success');
          this.getAllNotAssignedRole();
          this.fetchUpdatedAdmins.emit();
      }
      else{
        this.toastService.error(response.message, 'Failed');
      }
      },
      (error) => {
        this.toastService.error('Failed to delete role!', 'Failed');
      }
    );
  }
  onUpdateRoles() {
    const payload = {
      id: this.selectedAdmin.id,
      firstName: this.selectedAdmin.firstName,
      lastName: this.selectedAdmin.lastName,
      phoneNumber: this.selectedAdmin.phoneNumber,
      email: this.selectedAdmin.email,
      roleId: this.selectedNewRoles
    };
    
    this.rolesService.UpdateRolesForAdmin(payload).subscribe(
      (response) => {
        if (response.status == 200) {
          this.toastService.success(response.message, 'Success');
          // this.cancelEvent.emit()
          this.getAllNotAssignedRole();
          this.fetchUpdatedAdmins.emit();
      }
      else{
        this.toastService.error(response.message, 'Failed');
      }
      },
      (error) => {
        this.toastService.error('Failed find admins!', 'Failed');
      }
    );
  }
}
