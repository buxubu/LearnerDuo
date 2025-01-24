// this a 2 way another to match password

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function MatchPasswordValidator(matchTo: string): ValidatorFn {
  var reverse: boolean;
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    // problem here just abbreviated(viet tat) syntax neu control.parent co gia tri va pass vaf conPass giong
    // thi return null khong thi return matching: true
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };

    //another way to syntax simple and easy to understand
    //   if (
    //     control.parent &&
    //     control.parent?.value &&
    //     control.value === (control.parent?.controls as any)[matchTo].value
    //   ) {
    //     return null;
    //   } else {
    //     return { matching: true };
    //   }
    // };
  };
}
