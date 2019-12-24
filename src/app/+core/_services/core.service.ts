import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { TagModel } from '@models/tag.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl;

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
    this.http.get<{posts: PostModel[]}>(BACKEND_URL + '/posts/get-by-date')
      .subscribe((responseData) => {
        this.posts = responseData.posts.slice(0);
        this.postsSubject.next(responseData.posts);
      });
  }

  getTags() {
    this.http.get<{tagsArray: TagModel[]}>(BACKEND_URL + '/tags/get-all-tags')
      .subscribe((responseData) => {
        const orderTagsArray = responseData.tagsArray.map(item => {
          return { id : item._id, label: item.label }
        });
        this.tagsArray = orderTagsArray.slice(0);
        this.tagsSubject.next(orderTagsArray);
      });
  }
}
