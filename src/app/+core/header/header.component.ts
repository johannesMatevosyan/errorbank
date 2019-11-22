import { Component, OnInit } from '@angular/core';
import { AuthService } from "@app/+shared/_services/auth.service";
import { Subscription } from "rxjs/index";
import { SearchFilterService } from "@app/+shared/_services/search-filter.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  clientId: string = '8eee574d84d9fd8f73bd';
  message: string;
  profile: any;
  userIsAuthenticated = false;
  authListenerSubs: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              private searchFilterService: SearchFilterService) {}

  ngOnInit() {
    this.checkAuthenticationStatus();
    this.authListenerSubs = this.authService.userDataStorage.subscribe(userData =>  {
      if (userData) {
        this.profile = userData;
      }

    });
    this.searchFilterService.searchKey.subscribe(message => {
      this.message = message;
    })
  }

  checkAuthenticationStatus() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    if(this.userIsAuthenticated) {
      let userData = {
        userId : localStorage.getItem("_id"),
        githubId : localStorage.getItem("githubId"),
        name : localStorage.getItem("name"),
        login : localStorage.getItem("login"),
      };
      this.profile = userData;
    }
  }

  search(item) {
    this.searchFilterService.changeSearch(item)
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }

  onLogout() {
    this.authService.logout();
  }


}
