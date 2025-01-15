import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/Services/login.service';
import { ToastService } from '../../../Core/Services/ToastService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  forgetPassword: FormGroup;
  emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.forgetPassword = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailReg),
        ],
      ],
    });
  }

  onSubmit() {
    const emailControl = this.forgetPassword.get('email');
    if (emailControl?.value == null || emailControl?.value.trim() == '') {
      emailControl?.markAsTouched();
      return;
    }
    if(this.forgetPassword.valid){
      this.authService.SendOTPEmail(this.forgetPassword.value).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.toast.success(response.message, 'Success');
            this.router.navigate(['/check-your-email']);
            this.forgetPassword.reset();
          } else if (response.status === 404) {
            this.toast.error(response.message, 'Error');
          } else if (response.status === 500) {
            this.toast.error('An internal server error occurred.', 'Error');
          }
        },
        error: (error) => {
          this.toast.error('An error occurred while sending OTP.', 'Error');
          console.error('Error:', error);
        },
      });
    }
  }
}
