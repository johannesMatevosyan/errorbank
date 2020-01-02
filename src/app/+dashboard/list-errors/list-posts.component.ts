import {Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '@app/+dashboard/_services/post.service';
import { PageEvent } from '@angular/material';
import { PostModel } from '@models/post.model';
import { Subscription } from 'rxjs/index';
import { SearchFilterService } from '@app/+shared/_services/search-filter.service';
import { AuthService } from '@app/+shared/_services/auth.service';
import { TagModel } from '@models/tag.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-list-dashboard',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {
  selectedItem;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  pageIndex = 0;
  userIntegrity: {
    currentUserId: '';
    currentUserName: '';
  };

  searchText: string = '';
  searchPhrase: string = '';
  tagsArray: TagModel[] = [];
  filterByTagsArray: TagModel[] = [];
  posts: PostModel[] = [];
  query = {
    filter: {
      tags : [],
    },
    pagination : {
      pagesize: this.postsPerPage,
      page: this.currentPage
    },
    text: {
      word: this.searchText
    }
  };
  userIsAuthenticated = false;
  authStatusSub: Subscription;
  subscription: Subscription;
  // MatPaginator Output
  pageEvent: PageEvent;
  constructor(private postsService: PostService,
              public authService: AuthService,
              private sfService: SearchFilterService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.checkAuthenticationStatus();
    this.getAllPosts();
    this.searchPosts();
    this.searchByTagMethod();
    this.searchByTextMethod();
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
    let userData =  this.authService.userIdentitySubject;
    if (userData !== null) {
      this.subscription = userData.subscribe(userDataResponse => {
        if (userDataResponse) {
          this.userIntegrity = {
            currentUserId: userDataResponse.userId,
            currentUserName: userDataResponse.userName,
          };
        }
      });
    }

    this.subscription = this.postsService.getPostUpdateListener().subscribe(response => {
      if (response) {
        this.totalPosts = response.postCount;
        this.posts = response.posts;
      }
    });
  }

  searchPosts() {
    this.subscription = this.sfService.searchKey.subscribe(response => {
      if (response) {
        this.posts =  response.search;
      } else {
        this.posts = [];
      }

    });
  }

  searchByTagMethod() {
    this.subscription = this.sfService.tagList.subscribe(response => {
      if (response) {
        this.filterByTagsArray = response;
      }
    });
    this.subscription = this.sfService.searchByTagResponse.subscribe(response => {
      if (response) {
        this.posts = response.posts;
      }
    });

  }

  removeTagFromList(tag) {
    this.filterByTagsArray = this.filterByTagsArray.filter(item => item.label !== tag.label);
    this.sfService.removeTagFromList(tag);
  }

  searchByTextMethod() {
    this.subscription = this.sfService.textSource.subscribe(response => {
      if (response) {
        this.searchPhrase = response;
        this.query.text.word = response;
      }
    });
  }

  onDeletePost(id) {
    this.postsService.delete(id).subscribe(response => {
      if (response) {
        this.toastr.success('Success!', 'Post deleted successfully ');
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
    this.subscription = this.postsService.postsSubject.subscribe(response => {
      if (response) {
        this.posts = response;
      }
    });
  }

  onSetActiveClass(event, newValue) {
    this.selectedItem = newValue;
  }

  ngOnDestroy() {
    if (this.subscription) {// this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
