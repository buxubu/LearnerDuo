import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../models/user';
import { take } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User = {} as User;
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
    this.userService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user as User;
    });
  }
  ngOnInit(): void {
    //clear view if no roles
    if (!this.user.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    if (this.user.roles.some((r) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
