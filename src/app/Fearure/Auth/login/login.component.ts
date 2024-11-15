import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/Services/login.service';
import { Router } from '@angular/router';
import { LoaderService } from '../../../Core/Services/LoaderService';
import { ToastService } from '../../../Core/Services/ToastService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [], // Optional if provided in 'root'
})
export class LoginComponent {
  loginForm: FormGroup;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: LoaderService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.toastService.success('Operation Successful!', 'Success');
          console.log('Login successful', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.toastService.error('Invalid Email or Password!', 'Failed');

          console.error('Login failed', error);
        },
      });
    } else {
      this.toastService.error('Invalid Email or Password!', 'Failed');
      console.log('Form is invalid');
    }
  }
}
