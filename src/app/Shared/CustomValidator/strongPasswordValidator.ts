import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value || '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[$@$!%*?&]/.test(password);
    const isValidLength = password.length >= 8;

    const errors: ValidationErrors = {};

    if (!hasUpperCase) {
      errors['uppercase'] = 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      errors['lowercase'] = 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      errors['number'] = 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      errors['specialChar'] = 'Password must contain at least one special character.';
    }
    if (!isValidLength) {
      errors['length'] = 'Password must be at least 8 characters long.';
    }

    return Object.keys(errors).length ? errors : null;
  };
}
export function passwordConfirming(c: AbstractControl): { invalid: boolean } | null {
    if (c.get('password')?.value !== c.get('confirmPassword')?.value) {
      return { invalid: true };
    }
    return null;
  }
export function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }
