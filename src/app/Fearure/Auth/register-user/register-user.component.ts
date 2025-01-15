import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OnlyNumberDirective } from '../../../Shared/CustomDirective/OnlyNumberDirective';
import {
  passwordMatchValidator,
  strongPasswordValidator,
} from '../../../Shared/CustomValidator/strongPasswordValidator';
import { OnlyNumberWithFormatDirective } from '../../../Shared/CustomDirective/PhoneNumberFormat';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Core/Services/login.service';
import { ToastService } from '../../../Core/Services/ToastService';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    OnlyNumberDirective,
    OnlyNumberWithFormatDirective,
  ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent {
  registerForm: FormGroup;
  emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(18)]],
        lastName: ['', [Validators.required, Validators.maxLength(18)]],
        email: [
          '',
          {
            validators: [
              Validators.required,
              Validators.email,
              Validators.pattern(this.emailReg),
            ],
            asyncValidators: [this.duplicateEmailValidator()],
            updateOn: 'blur',
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
        password: ['', [Validators.required, strongPasswordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  duplicateEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return this.authService.duplicateUserCheck({ email: control.value }).pipe(
        map((response: any) => {
          return response?.status === 200 ? { duplicateEmail: true } : null;
        })
      );
    };
  }

  onSubmit() {
    this.markFormGroupTouched(this.registerForm);

    if (this.registerForm.valid) {
      console.log('Form submitted successfully', this.registerForm.value);
      this.authService.RegisterUser(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.status === 200 && response.data != null) {
            this.toast.success('User created successful!', 'Success');
            const email = this.registerForm.get('email')?.value;
            const password = this.registerForm.get('password')?.value;
            
            this.router.navigate(['/login'], {
              state: { email, password },
            });
            this.registerForm.reset();
            // this.router.navigate(['/login'])
          } else if (response.status === 409) {
            this.toast.error('Email already exists.', 'Error');
          } else if (response.status == 400) {
            this.toast.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.toast.error('An error occurred during registration.', 'Error');
          console.error('Error:', error);
        },
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
