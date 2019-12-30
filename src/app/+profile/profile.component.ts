import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Subscription} from "rxjs/index";
import {ActivatedRoute, Router} from '@angular/router';
import {UserModel} from "@models/user.model";
import {ProfileService} from "@app/+profile/_services/profile.service";
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserModel;
  subscribeUser: Subscription;
  selectedItem;
  userIdentity;
  activeRoute = '';
  constructor(private profileService: ProfileService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit() {

    this.checkActiveRoute();
    this.activatedRoute.params.subscribe(paramsId => {
      if (isPlatformBrowser(this.platformId)) {
        // localStorage will be available: we can use it.
        this.userIdentity = paramsId['id'] !== undefined ? paramsId['id'] : localStorage.getItem("_id");
        if (this.userIdentity) {
          this.profileService.getUserInfoById(this.userIdentity);
        }

        this.subscribeUser = this.profileService.userStorage.subscribe(user => {
          if (user) {
            this.profile = user;
          }
        });
      }

    });
  }

  checkActiveRoute() {
    if (this.router.url.indexOf('/user/profile') > -1) {
      this.activeRoute = 'profile';
    } else if (this.router.url.indexOf('/user/posts') > -1) {
      this.activeRoute = 'posts';
    } else if (this.router.url.indexOf('/user/favourites') > -1) {
      this.activeRoute = 'favourites';
    }
    this.onSetActiveClass(this.activeRoute);
  }

  onSetActiveClass(newValue) {
    this.selectedItem = newValue;
  }

}
