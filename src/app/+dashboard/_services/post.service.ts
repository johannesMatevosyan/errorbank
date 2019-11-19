import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import {TagModel} from "@models/tag.model";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = [];
  tagsArray = [];
  postSubject = new Subject<PostModel>();
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getAll(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{posts: PostModel[]; maxPosts: number}>(BACKEND_URL +'get-all' + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                created: post.created,
                updated: post.updated,
                tags: post.tags,
                author: post.author,
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostData) => {

        this.posts = transformedPostData.posts.slice(0);
        this.postsSubject.next(transformedPostData.posts);
      });
  }

  create(post) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);
    postData.append('created', post.created);
    postData.append('updated', post.updated);
    postData.append('tagsArray', JSON.stringify(post.tagsArray));

    this.http.post<PostModel[]>(BACKEND_URL + 'create', postData)
      .subscribe((responseData) => {
        this.posts.push(post);
        this.postsSubject.next(responseData);
      });
  }

  getPostById(postId: string) {
    this.http.get<{post: PostModel}>(BACKEND_URL + 'get-id/' + postId)
      .subscribe((responseData) => {
        this.postSubject.next(responseData.post);
      });
  }

  updatePostById(postId, post) {
    console.log('update : ', post);

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);
    postData.append('created', post.created);
    postData.append('updated', post.updated);
    postData.append('tagsArray', JSON.stringify(post.tagsArray));

    this.http.put<{post: PostModel[]}>(BACKEND_URL + 'update/' + postId, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/get-all']);
      });
  }

  delete(postId: string) {
    this.http.delete(BACKEND_URL + 'delete/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(obj => {
          return obj._id !== postId;
        });
        this.postsSubject.next(updatedPosts);
      });
  }

}
