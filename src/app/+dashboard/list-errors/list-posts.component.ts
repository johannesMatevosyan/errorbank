import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '@app/+dashboard/_services/post.service';
import {PostModel} from "@models/post.model";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {
  posts: PostModel[] = [];
  subscription: Subscription;
  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getAll();
    this.subscription = this.postService.postsSubject.subscribe(response => {
      this.posts = response;
    });
  }

  deletePost(id) {
    this.postService.delete(id);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
