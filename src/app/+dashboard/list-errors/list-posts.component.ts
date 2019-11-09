import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostService } from '@app/+dashboard/_services/post.service';
import { PageEvent } from '@angular/material';
import {PostModel} from "@models/post.model";
import {Subscription} from "rxjs/index";
import {SearchFilterService} from "@app/+shared/_services/search-filter.service";

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  posts: PostModel[] = [];
  subscription: Subscription;
  constructor(private postsService: PostService, private searchFilterService: SearchFilterService) { }

  ngOnInit() {
    this.postsService.getAll(this.postsPerPage, this.currentPage);
    this.subscription = this.postsService.postsSubject.subscribe(response => {
      this.posts = response;
    });
    this.subscription = this.searchFilterService.searchKey.subscribe(response => {
      this.posts =  response ? response.search : [];
    })
  }

  deletePost(id) {
    this.postsService.delete(id);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getAll(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
