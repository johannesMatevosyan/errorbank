import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from "@angular/router";
import { UserModel } from "@models/user.model";
import { environment } from "@env/environment";
import {CurrentDate} from "@utils/current-date";
import {isPlatformBrowser, isPlatformServer} from "@angular/common";

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
  userInfoDataStorage = new Subject<any>();
  authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  getToken() {
    let localToken;
    if (isPlatformBrowser(this.platformId)) {
      // localStorage will be available: we can use it.
      console.log('Browser side');
      localToken = localStorage.getItem('token');
    }
    if (isPlatformServer(this.platformId)) {
      // localStorage will be null.
      console.log('Server side');
    }
    return localToken;
  }

  getIsAuth() {
    let localToken;
    if (isPlatformBrowser(this.platformId)) {
      // localStorage will be available: we can use it.
      console.log('Browser side');
      localToken = localStorage.getItem('token');
    }
    if (isPlatformServer(this.platformId)) {
      // localStorage will be null.
      console.log('Server side');
    }
    return this.isAuthenticated || !!localToken;
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
          let cd = new CurrentDate();
          const userInfo = {
            'githubId': user['id'],
            'name': user['name'],
            'login': user['login'],
            'location': user['location'],
            'bio': user['bio'],
            'date': cd.getCurrentDate(),
          };
          const githubUser = {
            'githubId': user['id'],
            'name': user['name'],
            'login': user['login'],
          };
          this.saveUserInfo(userInfo);
          this.saveUser(githubUser);
          this.getJwtToken(user['id'], user['login']);
          this.router.navigate(['posts']);
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
          if (isPlatformBrowser(this.platformId)) {
            // localStorage will be available: we can use it.
            console.log('Browser side');
            localStorage.setItem("token", response['token']);
            localStorage.setItem("_id", response['userData']['_id']);
            localStorage.setItem("githubId", response['userData']['githubId']);
            localStorage.setItem("name", response['userData']['name']);
            localStorage.setItem("login", response['userData']['login']);
            localStorage.setItem("date", response['userData']['date']);
          }
          if (isPlatformServer(this.platformId)) {
            // localStorage will be null.
            console.log('Server side');
          }


        }

      });

  }


  saveUserInfo(user) {
    this.http.post<{user: UserModel}>(BACKEND_URL + '/user/save-user-info', user)
      .subscribe(response => {
        if (response) {
          this.userIdentitySubject.next(response.user._id);
          this.userInfoDataStorage.next(response.user);
        }
      });
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
    let token;
    let expirationDate;
    let userId;

    if (isPlatformBrowser(this.platformId)) {
      // localStorage will be available: we can use it.
      token = localStorage.getItem("token");
      expirationDate = localStorage.getItem("expiration");
      userId = localStorage.getItem("_id");


      this.userIdentitySubject.next(userId);

      if (!token || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate)
      }
    }
    if (isPlatformServer(this.platformId)) {
      // localStorage will be null.
      console.log('Server side');
    }

  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userIdentitySubject = null;
    this.clearAuthData();
    this.router.navigate(['/posts']);
  }

  private clearAuthData() {
    if (isPlatformBrowser(this.platformId)) {
      // localStorage will be available: we can use it.
      localStorage.clear();
      window.localStorage.clear();
    }
    if (isPlatformServer(this.platformId)) {
      // localStorage will be null.
      console.log('Server side');
    }
  }
}
