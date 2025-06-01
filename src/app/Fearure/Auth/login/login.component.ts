import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Core/Services/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoaderService } from '../../../Core/Services/LoaderService';
import { ToastService } from '../../../Core/Services/ToastService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: string | null = null;
  password: string | null = null;
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      });

      var email=this.router.getCurrentNavigation()?.extras?.state?.['email'];
      var password=this.router.getCurrentNavigation()?.extras?.state?.['password'];
      if(email != null && password != null ){
        this.loginForm.get('email')?.setValue(email);
        this.loginForm.get('password')?.setValue(password);
      }

  }
  ngOnInit() {
  }

   onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // res.accessToken and res.expires are valid
        this.toastService.success('Logged in successfully!', 'Success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.toastService.error('Invalid email or password!', 'Failed');
      },
    });
  }
}
