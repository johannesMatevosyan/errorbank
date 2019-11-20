import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/index";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: {};
  userStorage = new BehaviorSubject<any>(this.user);
  constructor(private http: HttpClient) { }

  getAllUsersInfo() {
    this.http.get(BACKEND_URL + 'list-info')
      .subscribe(response => {
      });
  }

  getUserInfoById(userId) {
    this.http.get(BACKEND_URL + 'info/' + userId)
      .subscribe(response => {

      });
  }


  getAllUsers(){
    this.http.get(BACKEND_URL + 'list-info')
      .subscribe(response => {
      });
  }

  getUserById(userId){
    return this.http.get(BACKEND_URL + 'profile/' + userId).subscribe(userData => {
      this.userStorage.next(userData['user']);
    });
  }

}
