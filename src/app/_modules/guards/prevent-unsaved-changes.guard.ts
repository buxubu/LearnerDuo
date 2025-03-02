import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  CanDeactivateFn,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
} from '@angular/router';
import { MemberEditComponent } from '../../members/member-edit/member-edit.component';
import { ConfirmDialogComponent } from '../../_modal/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../../services/confirm.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private confirmService: ConfirmService) {}

  canDeactivate(component: MemberEditComponent): Observable<boolean> | boolean {
    if (component.editForm?.dirty) {
      return this.confirmService.confirm();
    }
    return true;
  }
}
