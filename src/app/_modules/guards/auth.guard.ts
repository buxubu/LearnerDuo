import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const userServices = inject(UserService);
  const toastr = inject(ToastrService);
  return userServices.currentUser$.pipe(
    map((user) => {
      if (user) return true;
      toastr.error('You shall not pass!');
      return false;
    })
  );
};
