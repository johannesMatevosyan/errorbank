import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  posts = [];
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient) { }

  getAllByDate() {
    this.http.get<{posts: PostModel[]}>('http://localhost:3000/posts/get-by-date')
      .subscribe((responseData) => {
        this.posts = responseData.posts.slice(0);
        this.postsSubject.next(responseData.posts);
      });
  }
}
