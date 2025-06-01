import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultiSelectComponent } from '../../home/multi-select/multi-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../Core/Services/ToastService';
import { PermissionService } from '../../../../Core/Services/PermissionService';
import { RolesService } from '../../../../Core/Services/RolesService';

@Component({
  selector: 'app-admin-add-role',
  standalone: true,
  imports: [CommonModule,MultiSelectComponent,ReactiveFormsModule],
  templateUrl: './admin-add-role.component.html',
  styleUrls: ['./admin-add-role.component.css']
})
export class AdminAddRoleComponent implements OnInit {
@Output() cancelEvent = new EventEmitter<void>();
  createRoleForm: FormGroup;
  allPermissions: any[] = [];

constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toast: ToastService,
    private permissionService: PermissionService,
    private roleService: RolesService,
  ) {
    this.createRoleForm = this.fb.group(
      {
        roleName: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(18) ]],
        roleDescription: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(100) ]],
        permissions: [[], [Validators.required,Validators.minLength(1)]],
      }
    );
  }
ngOnInit(): void {
    this.permissionService.getAllPermissions().subscribe(
      (response) => {
        if (response.status == 200) {
          this.allPermissions = response.data.map((permission: any) => ({
            id: permission.permissionId,
            name: permission.permissionName,
          }));
;
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

  onAddRoles(){
console.log(this.createRoleForm.value)
    if (this.createRoleForm.valid) {
      const { roleName, roleDescription, permissions } = this.createRoleForm.value;
      const roleData = {
        Name: roleName,
        Description: roleDescription
      };
      this.roleService.createRole(roleData).subscribe(
        (response) => {
          if (response.status == 201) {
            const roleId = response.data.id;
            const permissionData = {
              RoleId: roleId,
              PermissionIds: permissions
            };
            this.roleService.addPermissionsToRole(permissionData).subscribe(
              (response) => {
                if (response.status == 200) {
                  this.toast.success(response.message, 'Success');
                  this.cancelEvent.emit();
                } else {
                  this.toast.error(response.message, 'Failed');
                }
              },
              (error) => {
                this.toast.error('Failed to add permissions!', 'Failed');
              }
            );
          } else if (response.status == 409) {
            this.toast.success(response.message, 'Success');
            this.cancelEvent.emit();
          } else {
            this.toast.error(response.message, 'Failed');
          }
        },
        (error) => {
          this.toast.error('Failed to create role!', 'Failed');
        }
      );
    } else {
      this.toast.error('Please fill all required fields!', 'Error');
    }
  }
}
