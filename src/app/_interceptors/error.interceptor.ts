import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class errorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error) {
                const modalStateErrors = [];
                if (error.error.errors) {
                  for (const key in error.error.errors) {
                    if (error.error.errors[key]) {
                      modalStateErrors.push(error.error.errors[key]);
                    }
                  }
                } else {
                  modalStateErrors.push(error.error);
                }
                throw modalStateErrors.flat().join(', ');
              } else if (typeof error.error === 'object') {
                this.toastr.error(error.statusText, error.status);
              } else {
                this.toastr.error('Bad request', error.status);
              }
              break;
            case 401:
              this.router.navigateByUrl('/');
              this.toastr.error('Unauthorizared', error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Somethings unexpected went wrong.');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
