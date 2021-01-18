import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      }
    })
    return next.handle(request).pipe(
      catchError(err => {
        if ([401, 403].includes(err.status) && this.tokenService.getInfos()) {
          this.toastr.error('An error of ' + err.statusText +' has occured', err.statusText, { timeOut: 4000 })

        }

        if (err.status === 404) {
          this.toastr.error(err.error.message, err.statusText, { timeOut: 4000 })
          
        }        
        // const error = (err && err.error && err.error.message) || err.statusText;
        // this.toastr.error(err.message !== undefined ? err.message : 'An error has occured', err.statusText, { timeOut: 4000 })

        return throwError(err);
      })
    );
  }
}
