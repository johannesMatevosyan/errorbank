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
  checkLateAuthentication = new BehaviorSubject<any>(this.data);
  userDataStorage = new BehaviorSubject<any>(this.data);
  authStatusListener = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserIdentity() {
    return this.userIdentitySubject;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getObs() {
    return this.checkLateAuthentication.asObservable();
  }

  getValue() {
    return this.authStatusListener.getValue();
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
            'id': user['id'],
            'name': user['name'],
            'login': user['login'],
          };
          this.saveUserInfo(userInfo);
          this.saveUser(githubUser);
          this.getJwtToken(user['id'], user['login']);
          this.checkLateAuthentication.next(true);
          this.router.navigate(['get-all']);
        } else {
          console.error("Undefined user");
        }
      });
  }

  getJwtToken(userId: string, userLogin: string) {
    let user = {id: userId, login: userLogin};
    this.http.post(BACKEND_URL + '/user/get-jwt-token', user)
      .subscribe(response => {
        if (response['token']) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.token = response['token'];
          localStorage.setItem("token", response['token']);
          localStorage.setItem("userId", response['userId']);
          localStorage.setItem("login", userLogin);
          localStorage.setItem("expiration", response['expiresIn']);

          const expiresInDuration = response['expiresIn'];
          this.setAuthTimer(expiresInDuration);
        }

      });

  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  saveUserInfo(user) {
    this.http.post(BACKEND_URL + '/user/save-user-info', user)
      .subscribe(response => {});
  }

  saveUser(user){
    this.http.post<{user: UserModel}>(BACKEND_URL + '/user/save-user', user)
      .subscribe(response => {

        if (response) {
          this.userIdentitySubject.next(response.user._id);
          this.userDataStorage.next(response.user);
        }

      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.checkLateAuthentication.next(false);
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
    localStorage.removeItem("userId");
  }
}
