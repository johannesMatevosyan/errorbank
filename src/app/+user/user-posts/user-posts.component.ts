import { Component, OnInit } from '@angular/core';
import {UserService} from "@app/+user/_services/user.service";
import {Subscription} from "rxjs/index";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPosts = [];
  subscribeUser: Subscription;
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      let userId = paramsId['id'];
      this.userService.getPostsUserById(userId);
      this.subscribeUser = this.userService.userPosts.subscribe(userPosts => {
        if (userPosts) {
          console.log('userPosts >> ', userPosts);
          this.userPosts = userPosts.slice(0);
        }
      });
    });

  }

}
