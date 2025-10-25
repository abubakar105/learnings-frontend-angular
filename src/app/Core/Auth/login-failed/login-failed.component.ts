import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-failed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <!-- Error Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-gray-800 mb-4">Login Failed</h1>
          <p class="text-gray-600 mb-8">
            We couldn't sign you in. Please try again or contact support if the problem persists.
          </p>

          <button 
            (click)="goToLogin()"
            class="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginFailedComponent {
  private router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}