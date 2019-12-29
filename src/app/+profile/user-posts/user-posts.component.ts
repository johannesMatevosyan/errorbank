import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService,} from "@app/+user/_services/user.service";
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit, OnDestroy {
  userPosts = [];
  subscribeUser: Subscription;
  constructor(private profileService: ProfileService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      this.profileService.getPostsUserById(userId);
      this.subscribeUser = this.profileService.userPosts.subscribe(userPosts => {
        if (userPosts) {
          this.userPosts = userPosts.slice(0);
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscribeUser.unsubscribe();
  }

}
