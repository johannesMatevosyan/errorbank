import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Subscription} from 'rxjs/index';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModel} from '@models/user.model';
import {ProfileService} from '@app/+profile/_services/profile.service';
import {isPlatformBrowser} from '@angular/common';
import {AuthService} from '@services/auth.service';

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
  profileId;
  userIntegrity = null;
  activeRoute = '';
  constructor(private profileService: ProfileService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit() {

    this.checkActiveRoute();
    this.getUserId();
    this.getProfileId();

    if (isPlatformBrowser(this.platformId)) {

      let url = this.router.url;
      this.profileId = url.substring(url.lastIndexOf('/') + 1);

      this.subscribeUser = this.profileService.userStorage.subscribe(user => {
        if (user) {
          this.profile = user;
        }
      });
    }

  }

  getUserId() {
    this.subscribeUser = this.authService.userIdentitySubject.subscribe(userData => {
      if (userData) {
        this.userIntegrity = userData;
      }
    });
  }

  getProfileId() {
    let url = this.router.url;
    this.profileId = url.substring(url.lastIndexOf('/') + 1);
  }

  checkActiveRoute() {
    if (this.router.url.indexOf('/user/profile') > -1) {
      this.activeRoute = 'profile';
    } else if (this.router.url.indexOf('/user/posts') > -1) {
      this.activeRoute = 'posts';
    } else if (this.router.url.indexOf('/user/favourites') > -1) {
      this.activeRoute = 'favourites';
    }else if (this.router.url.indexOf('/user/notifications') > -1) {
      this.activeRoute = 'notifications';
    }
    this.onSetActiveClass(this.activeRoute);
  }

  onSetActiveClass(newValue) {
    this.selectedItem = newValue;
  }

}
