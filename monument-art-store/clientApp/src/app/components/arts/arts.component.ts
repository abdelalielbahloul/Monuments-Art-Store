import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arts',
  templateUrl: './arts.component.html',
  styleUrls: ['./arts.component.css']
})
export class ArtsComponent implements OnInit {

  constructor(
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.setTitle('Arts')
  }



  setTitle(newTitle: string) {
    this.titleService.setTitle(`Monument Art Store - ${newTitle}`)
  }
}
