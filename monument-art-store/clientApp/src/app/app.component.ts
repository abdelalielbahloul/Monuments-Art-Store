import { TokenService } from './services/token.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  currentUser = null

  constructor(
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.tokenService.authStatus.subscribe(res => {
      this.currentUser = this.tokenService.getInfos();
    })
  }

}
