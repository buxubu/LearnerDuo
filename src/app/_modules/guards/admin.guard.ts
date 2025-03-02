import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { map, take } from 'rxjs';
import { User } from '../../models/user';
import { ToastrModule, ToastrService } from 'ngx-toastr';

export const AdminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toastrService = inject(ToastrService);

  return userService.currentUser$.pipe(
    map((user) => {
      if (user?.roles.includes('Admin') || user?.roles.includes('Moderator')) {
        return true;
      }
      toastrService.error("You can't enter this area");
      return false;
    })
  );
};
