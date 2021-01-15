import { Injectable } from '@angular/core';
import * as moment from "moment";
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // check if the user is authentified and has a valid token
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus = this.loggedIn.asObservable()
  constructor() {}

  set(data: any) {
    const expiredIn = moment().add(data.expiredIn,'s');
    localStorage.setItem('token', data.token);
    localStorage.setItem('expiredIn', JSON.stringify(expiredIn.valueOf()))
    localStorage.setItem('userId', data._id)
  }

  handle(data) {
    this.set(data);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('userId')
  }

  getExpirationDate() {
    const expiration = localStorage.getItem("expiredIn");
    const expiredIn = JSON.parse(expiration);
    return moment(expiredIn);
}  

  remove() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiredIn')
    localStorage.removeItem('userId')
  }

  // decode of token payload
  decode(payload) {
    return JSON.parse(atob(payload));
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  // verify if the token is valid
  isValid() {
    const token = this.getToken();
    const userId = this.getUserId()
    if(token) {
      const payload = this.payload(token);
      if(payload) return userId === payload.userId;

    }
    return false
  }

  getInfos() {
    const token = this.getToken();
    if(token) {
      const payload = this.payload(token);
      return payload ? payload : null;
    }
    return null;
  }

  isLoggedIn() {
    return this.isValid();
  }

  changeStatus(value: boolean) {
    this.loggedIn.next(value);
  }


}
