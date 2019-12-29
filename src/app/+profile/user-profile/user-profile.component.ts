import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from "@app/+profile/_services/profile.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/index";
import {UserModel} from "@models/user.model";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profile: UserModel;
  subscribeUser: Subscription;
  constructor(private profileService: ProfileService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      this.profileService.getUserInfoById(userId);
      this.subscribeUser = this.profileService.userStorage.subscribe(user => {
        if (user) {
          this.profile = user;
        }

      });
    });

  }


  ngOnDestroy() {
    if (this.subscribeUser) { // this if will detect undefined issue of timersub
      this.subscribeUser.unsubscribe();
    }
  }

}
