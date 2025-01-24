import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function PasswordStrength(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const hasNumber = /\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial;

  const ValidationErrors = {
    hasUpper: !hasUpper,
    hasLower: !hasLower,
    hasNumber: !hasNumber,
    hasSpecial: !hasSpecial,
  };

  // so if a certain value in the ValidationErrors is true then return ValidationErrors and opposite(nguoc lai)
  // (ex: hasUpper: !hasUpper "true" => return ValidationErrors)
  return passwordValid ? null : ValidationErrors;
}

function MatchPassword(control: AbstractControl): ValidationErrors | null {
  const password = control?.parent?.get('password')?.value;
  const confirmPassword = control.value;
  return password === confirmPassword ? null : { matching: true };
}

const PasswordValidator = {
  PasswordStrength,
  MatchPassword,
};

export default PasswordValidator;
