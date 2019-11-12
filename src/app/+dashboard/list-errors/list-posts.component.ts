import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PostService } from '@app/+dashboard/_services/post.service';
import { PageEvent } from '@angular/material';
import { PostModel } from "@models/post.model";
import { Subscription } from "rxjs/index";
import { SearchFilterService } from "@app/+shared/_services/search-filter.service";
import { AuthService } from "@app/+shared/_services/auth.service";

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
  userIsAuthenticated = false;
  authStatusSub: Subscription;
  subscription: Subscription;
  constructor(private postsService: PostService,
              public authService: AuthService,
              private searchFilterService: SearchFilterService) { }

  ngOnInit() {
    this.checkAuthenticationStatus();
    this.getAll();
    this.subscription = this.searchFilterService.searchKey.subscribe(response => {
      this.posts =  response ? response.search : [];
    });
  }

  checkAuthenticationStatus() {
    console.log('POSTS');
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        debugger;
        this.userIsAuthenticated = isAuthenticated;
      },error => {
        console.error('error: ', error);
      }, () => {
        console.log('onCompleted');
      });
   const AAAAA = this.authService.checkLateAuthentication.getValue();
   console.log('AAAAA ', AAAAA);
    this.authStatusSub = this.authService.checkLateAuthentication.subscribe(items =>  {
      console.log(' *********** test2 :  ', items);
    });

    this.authService.getObs().subscribe(profile => {
      console.log('profile : ', profile);
    });
  }

  getAll() {
    this.postsService.getAll(this.postsPerPage, this.currentPage);
    this.subscription = this.postsService.postsSubject.subscribe(response => {
      this.posts = response;
    });
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
