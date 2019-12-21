import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "@app/+user/_services/user.service";
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
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      this.userService.getUserInfoById(userId);
      this.subscribeUser = this.userService.userStorage.subscribe(user => {
        if (user) {
          console.log('user 1 ', user);
          this.profile = user;
        }

      });
    });

  }


  ngOnDestroy() {
    if(this.subscribeUser){ // this if will detect undefined issue of timersub
      this.subscribeUser.unsubscribe();
    }
  }

}
