import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MultiSelectComponent } from '../../home/multi-select/multi-select.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../Core/Services/ToastService';
import { PermissionService } from '../../../../Core/Services/PermissionService';
import { RolesService } from '../../../../Core/Services/RolesService';
import { DropdownDirective } from '../../../../Shared/CustomDirective/DropDownDirective';

@Component({
  selector: 'app-admin-update-role',
  standalone: true,
  imports: [CommonModule, MultiSelectComponent, ReactiveFormsModule,DropdownDirective],
  templateUrl: './admin-update-role.component.html',
  styleUrls: ['./admin-update-role.component.css'],
})
export class AdminUpdateRoleComponent implements OnInit ,OnChanges {
  @Input() selectedRole: any = null;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() fetchUpdatedRoles = new EventEmitter<void>();
  rolesPermissionsOpenMap: Map<number, boolean> = new Map();
  permissionsList: any[] = [];

  createRoleForm: FormGroup;
  allPermissions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toast: ToastService,
    private permissionService: PermissionService,
    private roleService: RolesService
  ) {
    this.createRoleForm = this.fb.group({
      roleName: [
        this.selectedRole?.roleName || '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(18),
        ],
      ],
      roleDescription: [
        this.selectedRole?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      permissions: [[], [Validators.required, Validators.minLength(1)]],
    });
  }
  ngOnChanges(selectedRole: SimpleChanges): void {
    this.permissionsList[0]=this.selectedRole;
  }
  ngOnInit(): void {
    this.getAllNotAssignedPermissions();
    this.patchForm()
    this.permissionsList[0]=this.selectedRole;
  }
  patchForm() {
    this.createRoleForm.patchValue({
      roleName:        this.selectedRole.roleName,
      roleDescription: this.selectedRole.description,
      // if you also want to pre-select existing permissions:
      permissions:     this.selectedRole.permissions.map((p: any) => p.permissionId)
    });
  }
  toggleRolePermissionsDropdown(index: number): void {
    this.rolesPermissionsOpenMap.set(index, !this.rolesPermissionsOpenMap.get(index));
  }

  closeRolePermissionsDropDown(index: number): void {
    this.rolesPermissionsOpenMap.set(index, false);
  }
  deletePermissionFromRole(permission: any) {
    console.log(permission);

    const payload = {
      RoleId: this.selectedRole.roleId,
      PermissionIds: [permission.permissionId]
    };
    this.roleService.RemovePermissionFromRole(payload).subscribe(
      (response) => {
        if (response.status == 200) {
          this.toast.success(response.message, 'Success');
          this.selectedRole.permissions =
          this.selectedRole.permissions
            .filter((p: { permissionId: any; }) => p.permissionId !== permission.permissionId);

          this.getAllNotAssignedPermissions();
          this.fetchUpdatedRoles.emit();
        } else {
          this.toast.error(response.message, 'Failed');
        }
      },
      (error) => {  
        this.toast.error('Failed to delete permission!', 'Failed');
      }
    );
  }
  getAllNotAssignedPermissions() {
    this.roleService.GetAllNotAssignedPermissionsForRole(this.selectedRole.roleId).subscribe(
      (response) => {
        if (response.status == 200) {
          this.allPermissions = response.data.map((permission: any) => ({
            id: permission.permissionId,
            name: permission.permissionName,
          }));
          console.log(this.allPermissions);
        } else {
          this.toast.error(response.message, 'Failed');
        }
      },
      (error) => {
        this.toast.error('Failed to fetch permissions!', 'Failed');
      }
    );
  }
  onPermissionChange(event: number[]) {
    // this.createRoleForm.patchValue({ permissions: event });
    console.log(event);
    this.createRoleForm.get('permissions')?.setValue(event);
  }

  onAddRoles() {
    console.log(this.createRoleForm.value);
    if (this.createRoleForm.valid) {
      const payload = {
        RoleId: this.selectedRole.roleId,
        RoleName: this.createRoleForm.value.roleName,
        RoleDescription: this.createRoleForm.value.roleDescription,
        PermissionsList: this.createRoleForm.value.permissions,
      }
      this.roleService.UpdateRoleWithPermissions(this.selectedRole.roleId,payload).subscribe(
        (response) => {
          if(response.status == 200) {
            this.toast.success(response.message, 'Success');
            this.fetchUpdatedRoles.emit();
            this.cancelEvent.emit();
          }
          else {
            this.toast.error(response.message, 'Failed');
          }
        },
        (error) => {
          this.toast.error('Failed to update role!', 'Failed');
        }
      );
    } else {
      this.toast.error('Please fill all required fields!', 'Error');
    }
  }
}
