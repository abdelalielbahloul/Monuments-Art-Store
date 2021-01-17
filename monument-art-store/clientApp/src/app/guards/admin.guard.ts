import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  connectedUser = null
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.connectedUser = this.tokenService.getInfos()
    if(this.connectedUser.role !== 'ADMIN') {
      this.router.navigateByUrl("/");
      return false
    }
    return true;
  }
  
}
