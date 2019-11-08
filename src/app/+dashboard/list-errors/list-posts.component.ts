import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '@app/+dashboard/_services/post.service';
import {PostModel} from "@models/post.model";
import {Subscription} from "rxjs/index";
import {SearchFilterService} from "@app/+shared/_services/search-filter.service";

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {

  posts: PostModel[] = [];
  subscription: Subscription;
  constructor(private postService: PostService, private searchFilterService: SearchFilterService) { }

  ngOnInit() {
    this.postService.getAll();
    this.subscription = this.postService.postsSubject.subscribe(response => {
      this.posts = response;
    });
    this.subscription = this.searchFilterService.searchKey.subscribe(response => {
      this.posts =  response ? response.search : [];
    })
  }

  deletePost(id) {
    this.postService.delete(id);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
