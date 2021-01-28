import { Art } from './../models/Art';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtService {

  constructor(private http: HttpClient) { }
  
  _fetch() {
    return this.http.get<Art[]>(`${environment.apiUrl}/arts`).pipe(
      map(data => data),
      catchError(this.handleError)
    );
  }

  _create(data: FormData) {
    return this.http.post(`${environment.apiUrl}/arts`, data)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }

  _delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/arts/${id}`)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }

  _update(data: FormData, _id) {
    return this.http.patch(`${environment.apiUrl}/arts/${_id}`, data)
      .pipe(
        map(res => res),
        catchError(this.handleError)
      )
  }

  handleError(error) { 
    return throwError(error);

  }
}
