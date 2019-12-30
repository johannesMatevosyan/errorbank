import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/index";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  user: {};
  userStorage = new BehaviorSubject<any>(this.user);
  userPosts = new BehaviorSubject<any>(this.user);
  userFavorites = new BehaviorSubject<any>(this.user);
  constructor(private http: HttpClient) { }

  getUserInfoById(userId) {
    this.http.get(BACKEND_URL + 'info/' + userId).subscribe(userData => {
      this.userStorage.next(userData['user']);
      });
  }

  getUserById(userId) {
    return this.http.get(BACKEND_URL + 'profile/' + userId).subscribe(userData => {
      this.userStorage.next(userData['user']);
    });
  }

  getPostsUserById(userId) {
    return this.http.get(BACKEND_URL + 'posts/' + userId).subscribe(userPosts => {
      if (userPosts) {
        this.userPosts.next(userPosts['posts']);
      }

    });
  }

  getFavPostsUserById(userId) {
    return this.http.get(BACKEND_URL + 'posts/favourites/' + userId).subscribe(userPosts => {
      if (userPosts) {
        this.userFavorites.next(userPosts['favouritePosts']);
      }
    });
  }

}
