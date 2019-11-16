import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { TagModel } from '@models/tag.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  posts = [];
  tagsArray = [];
  tagsSubject = new Subject<TagModel[]>();
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient) { }

  getAllByDate() {
    this.http.get<{posts: PostModel[]}>('http://localhost:3000/posts/get-by-date')
      .subscribe((responseData) => {
        this.posts = responseData.posts.slice(0);
        this.postsSubject.next(responseData.posts);
      });
  }

  getTags() {
    this.http.get<{tagsArray: TagModel[]}>('http://localhost:3000/tags/get-all-tags')
      .subscribe((responseData) => {
        const orderTagsArray = responseData.tagsArray.map(item => {
          return { id : item._id, label: item.label }
        });
        this.tagsArray = orderTagsArray.slice(0);
        this.tagsSubject.next(orderTagsArray);
      });
  }
}
