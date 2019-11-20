import { Injectable } from '@angular/core';
import { CommentModel } from "@models/comment.model";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/index";
import {PostModel} from "@models/post.model";

const BACKEND_URL = environment.apiUrl + '/comment/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  commentSubject = new Subject<CommentModel>();
  commentsSubject = new Subject<CommentModel[]>();
  constructor(private http: HttpClient) { }

  saveComment(comment) {
    this.http.post<{ comment: CommentModel}>(BACKEND_URL + 'create', comment)
      .subscribe((responseData) => {
        this.commentSubject.next(responseData.comment);
      });
  }

  getCommentsByPostID(postId: string) {
    this.http.get<{comment: CommentModel[]}>(BACKEND_URL + 'get/' + postId)
      .subscribe((responseData) => {
        this.commentsSubject.next(responseData.comment);
      });
  }
}
