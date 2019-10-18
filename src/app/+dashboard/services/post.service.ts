import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts = [];
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient) { }

  getAll() {
    this.http.get<{posts: PostModel[]}>('http://localhost:3000/posts/get-all')
      .subscribe((responseData) => {
        this.posts = responseData.posts.slice(0);
        console.log('All posts  ', this.posts);
        this.postsSubject.next(responseData.posts);
      });
  }

  create(post: PostModel[]) {

    this.http.post<PostModel[]>('http://localhost:3000/posts/create', post)
      .subscribe((responseData) => {
        this.posts.push(post);
        this.postsSubject.next(responseData);
      });
  }

  getPostById(postId: string) {
    this.http.get<{post: PostModel[]}>('http://localhost:3000/posts/get-id/' + postId)
      .subscribe((responseData) => {
        this.postsSubject.next(responseData.post);
      });
  }

  updatePostById(postId, data) {
    console.log('update : ', data);
    this.http.post<{post: PostModel[]}>('http://localhost:3000/posts/update/' + postId, data)
      .subscribe((responseData) => {
        console.log('updated responseData ', responseData);
        this.postsSubject.next(responseData.post);
      });
  }

  delete(postId: string) {
    this.http.delete('http://localhost:3000/posts/delete/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(obj => {
          return obj._id !== postId;
        });
        this.postsSubject.next(updatedPosts);
      });
  }
}
