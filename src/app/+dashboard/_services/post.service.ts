import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from "@angular/router";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = [];
  tagsArray = [];
  postSubject = new Subject<PostModel>();
  postsSubject = new Subject<PostModel[]>();
  isSubmitted = new Subject<boolean>();
  isUpdated = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getAll(query) {

    this.http.post<{posts: PostModel[]; maxPosts: number}>(BACKEND_URL, query)
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
                viewed: post.viewed,
                commented: post.numOfComments,
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

    this.http.post<PostModel[]>(BACKEND_URL + '/create', postData)
      .subscribe((responseData) => {
        if (responseData) {
          this.posts.push(post);
          this.postsSubject.next(responseData);
          this.isSubmitted.next(true);
        }

      });
  }

  getPostById(postId: string) {
    this.http.get<{post: PostModel}>(BACKEND_URL + '/get-id/' + postId)
      .subscribe((responseData) => {
        console.log('responseData.post ', responseData.post);
        this.postSubject.next(responseData.post);
      });
  }

  updatePostById(postId, post) {

    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);
    postData.append('created', post.created);
    postData.append('updated', post.updated);
    postData.append('tagsArray', JSON.stringify(post.tagsArray));

    this.http.put<{post: PostModel[]}>(BACKEND_URL + '/update/' + postId, postData)
      .subscribe((responseData) => {
        if (responseData) {
          this.isUpdated.next(true);
        }
      });
  }

  delete(postId: string) {
    return this.http.delete(BACKEND_URL + '/delete/' + postId);
  }

}
