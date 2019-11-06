import { Component, OnInit } from '@angular/core';
import {AuthService} from "@app/+shared/_services/auth.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profile: any;
  userIsAuthenticated = false;
  subscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log('localStorage in HEADER ', localStorage);
    this.subscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.subscription = this.authService.dataStorage.subscribe(items =>  {
      this.profile = items;
      console.log('this.profile  items ************ ', items);
      console.log('this.profile ************ ', this.profile);
      console.log(localStorage.getItem("user"));
    });
  }

  onLogout() {

  }

}
