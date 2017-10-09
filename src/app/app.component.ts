import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  providers: [],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  address: string;
  ngOnInit(): void {}
  constructor(private routerService: Router) {}

  setAddress() {
    console.log(this.address);
    this.routerService.navigateByUrl('viewtransaction');
  }
}
