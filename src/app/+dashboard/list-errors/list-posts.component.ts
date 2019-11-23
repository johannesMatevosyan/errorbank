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
  tagIdArray = [];
  posts: PostModel[] = [];
  query = {
    filter: {
      tags : [],
    },
    pagination : {
      pagesize: this.postsPerPage,
      page: this.currentPage
    }
  };
  userIsAuthenticated = false;
  authStatusSub: Subscription;
  subscription: Subscription;
  constructor(private postsService: PostService,
              public authService: AuthService,
              private sfService: SearchFilterService) { }

  ngOnInit() {
    this.checkAuthenticationStatus();
    this.getAllPosts();
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

  getAllPosts() {

    this.postsService.getAll(this.query);
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
        console.log(' ++ searchSource ', response);
        this.posts = response.posts;

        console.log(' ++ this.posts ', this.posts);

      }
    });
    this.subscription = this.sfService.tagSource.subscribe(response => {
      if (response) {
        this.filterByTagsArray = response;
        // this.query.filter.tags
        this.tagIdArray = response.map(tag => {
          return tag.id;
        });
        console.log('this.tagIdArray : ', this.tagIdArray);
      }
    });
  }

  onDeletePost(id) {
    this.postsService.delete(id).subscribe(response => {
      if (response) {
        this.getAllPosts();
      }
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.query.pagination.pagesize = this.postsPerPage;
    this.query.pagination.page = this.currentPage;

    this.postsService.getAll(this.query);
  }

  ngOnDestroy() {
    if(this.subscription){// this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
