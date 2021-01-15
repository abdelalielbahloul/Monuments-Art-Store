import { TokenService } from './../../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser = null

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tokenService.authStatus.subscribe(res => {
      this.currentUser = this.tokenService.getInfos();
    })
  }

  logout() {
    this.tokenService.remove();
    this.tokenService.changeStatus(false);
    this.router.navigateByUrl('/login')
  }

}
