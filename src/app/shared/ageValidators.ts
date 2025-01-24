import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function MinimumAgeValidator(minimumAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const currentDate = new Date();
    const birthDate = new Date(control.value);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < minimumAge) {
      return { ageTooLow: { requiredAge: minimumAge } };
    }
    return null;
  };
}
