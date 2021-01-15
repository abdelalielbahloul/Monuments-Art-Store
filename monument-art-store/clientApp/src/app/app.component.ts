import { TokenService } from './services/token.service';
import { Component, OnInit } from '@angular/core';
import { Menu } from './models/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  opened = true;
  title = 'clientApp';

  currentUser = null

  menuItems: Menu[] = [
    {
      name: 'Arts',
      icon: 'art_track',
      href: '/arts'
    },
    {
      name: 'users',
      icon: 'groups',
      href: '/users'
    }
  ];

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

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
