import { Injectable } from '@angular/core';
import { PostModel } from '@models/post.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;
  dataStorage = new BehaviorSubject<any>(this.data);
  authStatusListener = new Subject<boolean>();
  // dataStorage = this.items.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getGithubUser(user) {
    let data = {code: user};
    this.http.post('http://localhost:3000/user/signin/callback', data)
      .subscribe((responseData) => {
        console.log('responseData access_token ', responseData['access_token']);
        if (responseData['access_token']) {
          this.sendToken(responseData['access_token']);
        }
      });
  }

  sendToken(accessToken = null) {
    let data = {token: accessToken};
    this.http.post('http://localhost:3000/user/github/token', data)
      .subscribe((user) => {
        console.log('token response ', user);
        if (user && user['name']) {
          const userInfo = {
            'id': user['id'],
            'name': user['name'],
            'login': user['login'],
            'location': user['location'],
            'bio': user['bio'],
          };
          const githubUser = {
            'id': user['id'],
            'name': user['name'],
            'login': user['login'],
          };
          this.saveUserInfo(userInfo);
          this.saveUser(githubUser);
          this.authStatusListener.next(true);
          // this.saveAuthData(token, userId);
          this.dataStorage.next(githubUser);
          localStorage.setItem('user', JSON.stringify(githubUser));

          this.router.navigate(['get-all']);
        } else {
          console.error("Undefined user");
        }
      });
  }

  saveAuthData(token: string, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  }

  saveUserInfo(user) {
    this.http.post('http://localhost:3000/user/save-user-info', user)
      .subscribe(response => {
        console.log('saveUserInfo : ', response);
      });
  }

  getAllUsersInfo() {
    this.http.get('http://localhost:3000/user/list-info')
      .subscribe(response => {
        console.log('getAllUsersInfo : ', response);
      });
  }

  getUserInfoById(userId) {
    this.http.get('http://localhost:3000/user/info/' + userId)
      .subscribe(response => {
        console.log('getUserInfoById : ', response);
      });
  }

  saveUser(user){
    this.http.post('http://localhost:3000/user/save-user', user)
      .subscribe(response => {
        console.log('saveUser : ', response);
      });
  }

  getAllUsers(){
    this.http.get('http://localhost:3000/user/list-info')
      .subscribe(response => {
        console.log('getAllUsers : ', response);
      });
  }

  getUserById(userId){
    this.http.get('http://localhost:3000/user/list-info')
      .subscribe(response => {
        console.log('getAllUsers : ', response);
      });
  }

  signOut() {
    localStorage.clear();
    this.authStatusListener.next(false);
  }
}
