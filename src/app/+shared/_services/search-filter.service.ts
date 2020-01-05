import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {PostModel} from "@models/post.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {map} from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {
  posts = [];
  postsUpdated = new Subject<any>();
  searchText: string = '';
  postsPerPage = 2;
  currentPage = 1;
  fetchTagArray = [];
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
    },
    sortBy : { key: 'created', value : 1}
  };
  searchData: any;
  tagList = new BehaviorSubject(this.searchData);
  tagObject = new BehaviorSubject(this.searchData);
  textSource = new BehaviorSubject(this.searchData);
  searchByTextResponse = new BehaviorSubject(this.searchData);
  searchByTagResponse = new BehaviorSubject(this.searchData);
  searchKey = this.searchByTextResponse.asObservable();

  constructor(private http: HttpClient) { }

  searchByText(text: {searchItem: string}) {
    let searchText = text.searchItem;
    this.query.text.word = searchText;
    this.http.post(BACKEND_URL, this.query)
      .pipe(
        map(postData => {
          return {
            posts: postData['posts'].map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                updated: post.updated,
                tags: post.tags,
                author: post.author,
                viewed: post.viewed,
                voted: post.voteObj,
                commented: post.numOfComments,
              };
            }),
            maxPosts: postData['maxPosts']
          };
        })
      )
      .subscribe((searchResponse: any) => {
        this.posts = searchResponse.posts;
        this.textSource.next(searchText);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: searchResponse.maxPosts
        });
      });

  }

  searchByTag(tagObj) {
    this.query.filter.tags = [];
    this.fetchTagArray.push(tagObj);
    this.tagList.next(this.fetchTagArray);
    let searchData = [];
    searchData = this.fetchTagArray.map((item) => {
      return item.id;
    });

    this.query.filter.tags = searchData;
    this.http.post(BACKEND_URL, this.query)
      .subscribe((searchResponse: any) => {
        this.searchByTagResponse.next(searchResponse);
      });
  }

  removeTagFromList(tag) {
    this.query.filter.tags = [];
    this.tagObject.next(tag);
    let searchData = [];
    this.fetchTagArray = this.fetchTagArray.filter((item) => {
      return item.id !== tag.id;
    });

    searchData = this.fetchTagArray.map((item) => {
      return item.id;
    });


    this.query.filter.tags = searchData;
    this.http.post(BACKEND_URL, this.query)
      .subscribe((searchResponse: any) => {
        this.searchByTagResponse.next(searchResponse);
      });
  }

  sortByDate(sortOrder) {
    this.query.sortBy['key'] = 'created';
    this.query.sortBy['value'] = sortOrder;
    this.query.pagination.page = 1;
    this.http.post(BACKEND_URL, this.query)
      .pipe(
        map(postData => {
          return {
            posts: postData['posts'].map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                updated: post.updated,
                tags: post.tags,
                author: post.author,
                viewed: post.viewed,
                voted: post.voteObj,
                commented: post.numOfComments,
              };
            }),
            maxPosts: postData['maxPosts']
          };
        })
      )
      .subscribe((sortResult) => {
        this.posts = sortResult.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: sortResult.maxPosts
        });
      });
  }

  sortByViews(sortOrder) {
    this.query.sortBy['key'] = 'viewed';
    this.query.sortBy['value'] = sortOrder;
    this.query.pagination.page = 1;
    this.http.post(BACKEND_URL, this.query)
      .pipe(
        map(postData => {
          return {
            posts: postData['posts'].map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                updated: post.updated,
                tags: post.tags,
                author: post.author,
                viewed: post.viewed,
                voted: post.voteObj,
                commented: post.numOfComments,
              };
            }),
            maxPosts: postData['maxPosts']
          };
        })
      )
      .subscribe((sortResult) => {
        this.posts = sortResult.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: sortResult.maxPosts
        });
      });
  }

  sortByCommentCount(sortOrder) {
    this.query.sortBy['key'] = 'numOfComments';
    this.query.sortBy['value'] = sortOrder;
    this.query.pagination.page = 1;
    this.http.post(BACKEND_URL, this.query)
      .pipe(
        map(postData => {
          return {
            posts: postData['posts'].map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                updated: post.updated,
                tags: post.tags,
                author: post.author,
                viewed: post.viewed,
                voted: post.voteObj,
                commented: post.numOfComments,
              };
            }),
            maxPosts: postData['maxPosts']
          };
        })
      )
      .subscribe((sortResult) => {
        this.posts = sortResult.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: sortResult.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

}

