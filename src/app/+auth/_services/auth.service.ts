import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  posts = [];
  postsSubject = new Subject<PostModel[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getGithubUser(user) {
    let data = {code: user}
    this.http.post('http://localhost:3000/user/signin/callback', data)
      .subscribe((responseData) => {
        console.log('responseData ', responseData);
        console.log('responseData access_token ', responseData['access_token']);
        if (responseData['access_token']) {
          this.sendToken(responseData['access_token']);
        }
      });
  }

  sendToken(token) {
    let data = {token: token}
    this.http.post('http://localhost:3000/user/github/token', data)
      .subscribe((user) => {
        console.log('token response ', user);
        if (user && user['name']) {
          this.router.navigate(['dashboard']);
        }else {
          console.error("Undefined user");
        }
      });
  }
}
