import { Injectable } from '@angular/core';
import { CommentModel } from "@models/comment.model";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";

const BACKEND_URL = environment.apiUrl + '/comment/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  saveComment(comment) {
    this.http.post<CommentModel[]>(BACKEND_URL + 'create', comment)
      .subscribe((responseData) => {
        console.log('responseData : ', responseData)
      });
  }
}
