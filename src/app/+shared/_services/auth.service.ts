import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from "@angular/router";
import { UserModel } from "@models/user.model";
import { environment } from "@env/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;
  tokenTimer: any;
  token: string;
  userIdentitySubject = new BehaviorSubject<any>(this.data);
  isAuthenticated: boolean = false;
  userDataStorage = new Subject<any>();
  authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated || !!localStorage.getItem('token');
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getGithubUser(user) {
    let data = {code: user};
    this.http.post(BACKEND_URL + '/user/signin/callback', data)
      .subscribe((responseData) => {
        if (responseData['access_token']) {
          this.sendToken(responseData['access_token']);
        }
      });
  }

  sendToken(accessToken = null) {
    let data = {token: accessToken};
    this.http.post(BACKEND_URL + '/user/github/token', data)
      .subscribe((user) => {
        if (user && user['name']) {
          const userInfo = {
            'id': user['id'],
            'name': user['name'],
            'login': user['login'],
            'location': user['location'],
            'bio': user['bio'],
          };
          const githubUser = {
            'githubId': user['id'],
            'name': user['name'],
            'login': user['login'],
          };
          this.saveUserInfo(userInfo);
          this.saveUser(githubUser);
          this.getJwtToken(user['id'], user['login']);
          this.router.navigate(['get-all']);
        } else {
          console.error("Undefined user..");
        }
      });
  }

  getJwtToken(githubId: string, userLogin: string) {
    let user = {id: githubId, login: userLogin};
    this.http.post(BACKEND_URL + '/user/get-jwt-token', user)
      .subscribe(response => {
        if (response['token']) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.token = response['token'];
          localStorage.setItem("token", response['token']);
          localStorage.setItem("_id", response['userData']['_id']);
          localStorage.setItem("githubId", response['userData']['githubId']);
          localStorage.setItem("name", response['userData']['name']);
          localStorage.setItem("login", response['userData']['login']);
        }

      });

  }


  saveUserInfo(user) {
    this.http.post(BACKEND_URL + '/user/save-user-info', user)
      .subscribe(response => {});
  }

  saveUser(user){
    this.http.post<{user: UserModel}>(BACKEND_URL + '/user/save-user', user)
      .subscribe(response => {
        if (response !== null) {
          this.userIdentitySubject.next(response.user._id);
          this.userDataStorage.next(response.user);
        }

      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    if (this.getIsAuth()) {

      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);

    } else {
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
    }

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    this.userIdentitySubject.next(userId);

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userIdentitySubject = null;
    this.clearAuthData();
    this.router.navigate(['/get-all']);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("login");
    localStorage.removeItem("githubId");
    localStorage.removeItem("name");
    localStorage.removeItem("_id");
  }
}
