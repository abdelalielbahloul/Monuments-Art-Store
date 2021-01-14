import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  _login(data: { login: string, password: string }) {
    return this.http.post("http://localhost:3333/api/auth/login", data).pipe(
      map(data => data),
      catchError(this.handleError)
    )
  }

  handleError(error) { 
    return throwError(error);
 
  }
}
