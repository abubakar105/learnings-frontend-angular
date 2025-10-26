import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AzureAuthService } from '../services/auth.service';
import { AuthService } from '../../Services/login.service';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventType, EventMessage } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div class="max-w-md w-full">
        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
          <!-- Logo/Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="text-center mb-6">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p class="text-gray-600">{{ loadingMessage }}</p>
          </div>

          <!-- Login State -->
          <div *ngIf="!isLoading">
            <!-- Title -->
            <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">
              Admin Dashboard
            </h1>
            <p class="text-center text-gray-600 mb-8">
              Sign in with your Microsoft account to continue
            </p>

            <!-- Login Button -->
            <button 
              (click)="login()"
              [disabled]="isLoading"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
              </svg>
              <span>Sign in with Microsoft</span>
            </button>

            <!-- Additional Info -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-500">
                Secure authentication powered by Microsoft Azure AD
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-white text-sm">
            © 2025 Admin Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private azureAuthService = inject(AzureAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private msalBroadcastService = inject(MsalBroadcastService);

  isLoading = false;
  loadingMessage = '';

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe({
        next: () => {
          console.log('Azure login success detected');
          this.initializeUser();
        }
      });

    // Check if user is already logged in
    if (this.azureAuthService.isAuthenticated()) {
      console.log('User already authenticated, initializing...');
      this.initializeUser();
    }
  }

  async login(): Promise<void> {
  try {
    console.log('Login button clicked');
    this.isLoading = true;
    this.loadingMessage = 'Redirecting to Microsoft...';
    
    await this.azureAuthService.loginWithAzure();
  } catch (error) {
    console.error('Login failed:', error);
    this.isLoading = false;
    this.loadingMessage = '';
    alert('Failed to start login. Please try again.');
  }
}

  private initializeUser(): void {
    this.isLoading = true;
    this.loadingMessage = 'Initializing your account...';

    console.log('Calling initializeAzureUser...');

    this.authService.initializeAzureUser().subscribe({
      next: (roles) => {
        console.log('User initialized with roles:', roles);
        this.isLoading = false;
        
        // Navigate to admin dashboard
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Failed to initialize user:', error);
        this.isLoading = false;
        this.loadingMessage = '';
        alert('Failed to initialize user. Please try again or contact support.');
      }
    });
  }
}