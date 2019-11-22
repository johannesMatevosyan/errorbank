import {Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '@app/+dashboard/_services/post.service';
import { PageEvent } from '@angular/material';
import { PostModel } from "@models/post.model";
import { Subscription } from "rxjs/index";
import { SearchFilterService } from "@app/+shared/_services/search-filter.service";
import { AuthService } from "@app/+shared/_services/auth.service";
import { TagModel } from "@models/tag.model";
import { PostInfoService } from "@app/+dashboard/_services/post-info.service";

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
  userIntegrity: string;
  tagsArray: TagModel[] = [];
  filterByTagsArray: TagModel[] = [];
  posts: PostModel[] = [];
  userIsAuthenticated = false;
  authStatusSub: Subscription;
  subscription: Subscription;
  constructor(private postsService: PostService,
              public authService: AuthService,
              private sfService: SearchFilterService) { }

  ngOnInit() {
    this.checkAuthenticationStatus();
    this.getAll();
    this.searchPosts();
    this.searchByTags();
  }

  checkAuthenticationStatus() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      },error => {
        console.error('error: ', error);
      }, () => {
        console.log('onCompleted');
      });

  }

  getAll() {
    this.postsService.getAll(this.postsPerPage, this.currentPage);
    this.subscription = this.authService.userIdentitySubject.subscribe(response => {
      if (response) {
        this.userIntegrity = response;
      }
    });
    this.subscription = this.postsService.postsSubject.subscribe(response => {
      if (response) {
        this.posts = response;
      }
    });
  }

  searchPosts() {
    this.subscription = this.sfService.searchKey.subscribe(response => {
      this.posts =  response ? response.search : [];
    });
  }

  searchByTags() {
    this.subscription = this.sfService.searchSource.subscribe(response => {
      if (response) {
        console.log('response searchSource ', response.searchTags);
        this.posts = response.searchTags;
      }
    });
    this.subscription = this.sfService.tagSource.subscribe(response => {
      if (response) {
        this.filterByTagsArray = response;
        console.log('************* tagSource response ', response);
      }
    });
  }

  onDeletePost(id) {
    this.postsService.delete(id).subscribe(response => {
      if (response) {
        this.getAll();
      }
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getAll(this.postsPerPage, this.currentPage);
  }

  filterByTag(tagObject) {
    console.log('filterByTag ', tagObject);
  }

  ngOnDestroy() {
    if(this.subscription){// this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
