import { Component, OnInit } from '@angular/core';
import { AuthService } from "@app/+shared/_services/auth.service";
import { Subscription } from "rxjs/index";
import { SearchFilterService } from "@app/+shared/_services/search-filter.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  message: string;
  profile: any;
  userIsAuthenticated = false;
  subscription: Subscription;
  constructor(private authService: AuthService, private searchFilterService: SearchFilterService) {}

  ngOnInit() {
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

    this.searchFilterService.searchKey.subscribe(message => {
      this.message = message;
    })
  }

  search(item) {
    this.searchFilterService.changeSearch(item)
  }
  onLogout() {

  }

}
