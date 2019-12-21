import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import { AuthService } from "@app/+shared/_services/auth.service";
import { Subscription } from "rxjs/index";
import { SearchFilterService } from "@app/+shared/_services/search-filter.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

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
  searchForm: FormGroup;
  authListenerSubs: Subscription;
  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private sfService: SearchFilterService, @Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit() {

    this.checkAuthenticationStatus();
    this.loadSearchForm();
    this.authListenerSubs = this.authService.userInfoDataStorage.subscribe(userData =>  {
      if (userData) {
        this.profile = userData;
      }

    });
    this.sfService.searchKey.subscribe(message => {
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
      if (isPlatformBrowser(this.platformId)) {
        // localStorage will be available: we can use it.
        console.log('Browser side');
        let userData = {
          _id : localStorage.getItem("_id"),
          userId : localStorage.getItem("_id"),
          githubId : localStorage.getItem("githubId"),
          name : localStorage.getItem("name"),
          login : localStorage.getItem("login"),
        };
        this.profile = userData;
      }
      if (isPlatformServer(this.platformId)) {
        // localStorage will be null.
        console.log('Server side');
      }

    }
  }

  loadSearchForm() {

    this.searchForm = this.fb.group({
      searchItem: [''],
    });
  }

  onSubmit() {
    this.sfService.searchByText(this.searchForm.value)
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri]));
  }

  onLogout() {
    this.authService.logout();
  }


}
