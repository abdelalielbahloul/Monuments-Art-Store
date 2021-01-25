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
    return this.http.post(`${environment.apiUrl}/users`, data)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }

  _delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }

  _update(data: FormData, _id) {
    return this.http.patch(`${environment.apiUrl}/users/${_id}`, data)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }
  
  handleError(error) { 
    return throwError(error);
 
  }
}
