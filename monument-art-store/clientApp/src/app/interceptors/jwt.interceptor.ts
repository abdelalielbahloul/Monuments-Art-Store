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

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`
      }
    })
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].includes(err.status) && this.tokenService.getInfos()) {
          // auto logout if 401 or 403 response returned from api
          this.tokenService.remove()
      }

      const error = (err && err.error && err.error.message) || err.statusText;
      console.error(err);
      return throwError(error);
  }));
  }
}
