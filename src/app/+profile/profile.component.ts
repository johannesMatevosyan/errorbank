import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {UserModel} from "@models/user.model";
import {ProfileService} from "@app/+profile/_services/profile.service";

@Component({
  selector: 'app-user',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserModel;
  subscribeUser: Subscription;
  selectedItem;
  constructor(private profileService: ProfileService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.onSetActiveClass(event, 'profile');
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      if (userId) {
        this.profileService.getUserInfoById(userId);
      }

      this.subscribeUser = this.profileService.userStorage.subscribe(user => {
        if (user) {
          this.profile = user;
        }
      });
    });
  }

  onSetActiveClass(event, newValue) {
    this.selectedItem = newValue;
  }

}
