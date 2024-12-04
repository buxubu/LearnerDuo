import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private userServices: UserService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let currentUser: User | any;

    this.userServices.currentUser$
      .pipe(take(1))
      .subscribe((user) => (currentUser = user as User));
    if (currentUser) {
      req = req.clone({
        setHeaders: {
          Authorization: ('Bearer ' + currentUser.token) as string,
        },
      });
    }
    return next.handle(req);
  }
}
