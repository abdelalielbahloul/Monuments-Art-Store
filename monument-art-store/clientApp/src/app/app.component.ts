import { Component } from '@angular/core';
import { Menu } from './models/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = true;
  title = 'clientApp';

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
}
