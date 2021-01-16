import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { User } from "../models/user";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  _fetch(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      map(data => data),
      catchError(this.handleError)
    );
  }

  _create(data: FormData) {
    return this.http.post(`${environment.apiUrl}/users`, data, { reportProgress: true, observe: 'events'})
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }
  
  handleError(error) { 
    return throwError(error);
 
  }
}
