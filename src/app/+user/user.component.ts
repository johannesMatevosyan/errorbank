import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import {UserModel} from "@models/user.model";
import {UserService} from "@app/+user/_services/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  profile: UserModel;
  subscribeUser: Subscription;
  selectedItem;
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.onSetActiveClass(event, 'profile');
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      if (userId) {
        this.userService.getUserInfoById(userId);
      }

      this.subscribeUser = this.userService.userStorage.subscribe(user => {
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
