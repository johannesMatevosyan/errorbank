import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: {};
  userStorage = new BehaviorSubject<any>(this.user);
  constructor(private http: HttpClient) { }

  getAllUsersInfo() {
    this.http.get('http://localhost:3000/user/list-info')
      .subscribe(response => {
      });
  }

  getUserInfoById(userId) {
    this.http.get('http://localhost:3000/user/info/' + userId)
      .subscribe(response => {

      });
  }


  getAllUsers(){
    this.http.get('http://localhost:3000/user/list-info')
      .subscribe(response => {
      });
  }

  getUserById(userId){
    console.log('*********** userId ********* ', userId);
    return this.http.get('http://localhost:3000/user/profile/' + userId).subscribe(userData => {
      console.log('*********** user ********* ', userData['user']);
      this.userStorage.next(userData['user']);
    });
  }

}
