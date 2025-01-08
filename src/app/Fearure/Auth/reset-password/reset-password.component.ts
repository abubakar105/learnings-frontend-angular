import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../Core/Services/login.service';
import { ToastService } from '../../../Core/Services/ToastService';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator, strongPasswordValidator } from '../../../Shared/CustomValidator/strongPasswordValidator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  email: string | null = null;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, strongPasswordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }
  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.value;

      if (password !== confirmPassword) {
        this.toast.error('Passwords do not match.', 'Error');
        return;
      }

      const resetData = {
        email: this.email,
        token: this.token,
        password: password,
      };

      this.authService.changePassword(resetData).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.toast.success(response.message, 'Success');
            this.router.navigate(['/login']);
          } else {
            this.toast.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.toast.error('An error occurred while resetting the password.', 'Error');
          console.error('Error:', error);
        },
      });
    }
  }
}
