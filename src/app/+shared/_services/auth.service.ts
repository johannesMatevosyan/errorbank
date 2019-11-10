import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;
  token: string;
  isAuthenticated: boolean = false;
  dataStorage = new BehaviorSubject<any>(this.data);
  authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getGithubUser(user) {
    let data = {code: user};
    this.http.post('http://localhost:3000/user/signin/callback', data)
      .subscribe((responseData) => {
        console.log(' ***** responseData access_token ', responseData['access_token']);
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
          // this.isAuthenticated = true;
          // this.authStatusListener.next(true);
          this.getJwtToken(user['id'], user['login']);
          this.dataStorage.next(githubUser);
          this.router.navigate(['get-all']);
        } else {
          console.error("Undefined user");
        }
      });
  }

  getJwtToken(userId: string, userLogin: string) {
    let user = {id: userId, login: userLogin}
    this.http.post('http://localhost:3000/user/get-jwt-token', user)
      .subscribe(response => {
        console.log(' getJwtToken ** : ', response);
        if (response['token']) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.token = response['token'];
          localStorage.setItem("token", response['token']);
          localStorage.setItem("userId", response['userId']);
          localStorage.setItem("login", userLogin);
          localStorage.setItem("expiration", response['expiresIn']);
        }

      });

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
        console.log('getAllUsersInfo  : ', response);
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

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // clearTimeout(this.tokenTimer);
    // this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/get-all']);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("login");
    localStorage.removeItem("userId");
  }
}
