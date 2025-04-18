import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../Core/Services/login.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DuplicateCheckValidator {
  constructor(private authService: AuthService) {}

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return this.authService.duplicateUserCheck({ email: control.value }).pipe(
        map((response: any) => {
          return response?.status === 200 ? { duplicateEmail: true } : null;
        })
      );
    };
  }
}
