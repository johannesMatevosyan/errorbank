import { Component, OnInit, OnDestroy } from '@angular/core';
import {UserService} from "@app/+user/_services/user.service";
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-favorite-posts',
  templateUrl: './user-favorite-posts.component.html',
  styleUrls: ['./user-favorite-posts.component.css']
})
export class UserFavoritePostsComponent implements OnInit, OnDestroy {
  userPosts = [];
  subscribeUser: Subscription;
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute
      .params
      .subscribe(params => {
        this.userService.getFavPostsUserById(params.id);
        this.subscribeUser = this.userService.userFavorites.subscribe(userPosts => {
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
