import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {VoteModel} from "@models/vote.model";

const BACKEND_URL = environment.apiUrl + '/post-info/';

@Injectable({
  providedIn: 'root'
})
export class PostInfoService {
  postCommentedSubject = new Subject<any>();
  postVotedSubject = new Subject<any>();
  constructor(private http: HttpClient) { }

  getPostCommentsInfoById (postId) {
    this.http.get<any>(BACKEND_URL + 'get-by-id/' + postId)
      .subscribe((responseData) => {
        this.postCommentedSubject.next(responseData);
      });
  }

  voteForPost(vote) {
    this.http.post<VoteModel[]>(BACKEND_URL + 'vote-for-post', vote)
      .subscribe((responseData) => {
        this.postVotedSubject.next(responseData);
      });
  }

}
