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
import { delay, finalize, Observable, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../models/user';
import { BusyService } from '../../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private busyServices: BusyService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.busyServices.busy();
    return next.handle(req).pipe(
      delay(1000),
      finalize(() => {
        this.busyServices.idle();
      })
    );
  }
}
