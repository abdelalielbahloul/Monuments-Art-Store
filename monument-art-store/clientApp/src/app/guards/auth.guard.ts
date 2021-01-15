import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if(!this.tokenService.isLoggedIn()) {
      this.tokenService.remove();
      this.tokenService.changeStatus(false);
      this.router.navigateByUrl("/login");
      return false
    }
    return true;
  }
  
}
