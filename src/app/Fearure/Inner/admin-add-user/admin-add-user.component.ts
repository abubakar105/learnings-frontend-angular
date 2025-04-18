import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Core/Services/login.service';
import { ToastService } from '../../../Core/Services/ToastService';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { OnlyNumberDirective } from '../../../Shared/CustomDirective/OnlyNumberDirective';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { RolesService } from '../../../Core/Services/RolesService';
import { DuplicateCheckValidator } from '../../../Shared/Methods/duplicateEmailCheck';

@Component({
  selector: 'app-admin-add-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent,
    OnlyNumberDirective
  ],
  templateUrl: './admin-add-user.component.html',
  styleUrls: ['./admin-add-user.component.css'],
})
export class AdminAddUserComponent implements OnInit {
  addUser: FormGroup;
  emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  availableRoles: Array<{ id: number, name: string }> = [
  ];
  @Output() cancelEvent = new EventEmitter<void>();
    constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private rolesService: RolesService,
    private toast: ToastService,
    private router: Router,
    private duplicateCheckValidator: DuplicateCheckValidator
  ) {
    this.fetchRoles();
    this.addUser = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(18)]],
      lastName: ['', [Validators.required, Validators.maxLength(18)]],
      email: [
        '',
        {
          validators: [
            Validators.required,
            Validators.email,
            Validators.pattern(this.emailReg),
          ]
        },
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.pattern(/^\d{10,14}$/),
        ],
      ],
      roleId: [[], Validators.required] 
    });
  }
  ngOnInit(): void {
  }
  fetchRoles() {
    this.rolesService.getAllRoles().subscribe({
      next:(response)=>{
        if(response.status === 200 && response.data != null){
          this.availableRoles = response.data.map((role: any) => ({
            id: role.id,
            name: role.name
          }));
        }
        else if (response.status == 400) {
          this.toast.error(response.message, 'Error');
        }
      },
      error:(err)=>{
        this.toast.error('An error occurred getting roles.'+err, 'Error');
        console.error('Error:', err);
      }
    });
  }
    
  onCancel(): void {
    this.cancelEvent.emit();
  }
  onRolesChange(selectedRoleIds: number[]) {
    this.addUser.patchValue({ roleId: selectedRoleIds });
  }
  onSubmit() {
    if (this.addUser.valid) {
      console.log('Form submitted successfully', this.addUser.value);
      this.rolesService.assignOrAddAdminAndRoles(this.addUser.value).subscribe({
        next: (response) => {
          if (response.status === 200 && response.data != null) {
            this.toast.success(response.message, 'Success');
            this.router.navigate(['/admin/users']);
            this.addUser.reset();
          } else {
            this.toast.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.toast.error('An error occurred while adding the admin.', 'Error');
          console.error('Error:', error);
        },
      });
    }
    else {
      this.addUser.markAllAsTouched();
    }
  }
}
