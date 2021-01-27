import { ToastrService } from 'ngx-toastr';
import { TokenService } from './../services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  connectedUser = null
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this.connectedUser = this.tokenService.getInfos()   
    
    if(this.connectedUser.role !== 'ADMIN') {
      this.router.navigateByUrl("/");
      this.toastr.warning('You do not have permission to access this route', 'Unauthorized', { timeOut: 5000 })
      return false
    }
    return true;
  }
  
}
