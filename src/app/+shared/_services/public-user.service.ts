import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs/index";
import {environment} from "@env/environment";

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class PublicUserService {
  user: {};
  userStorage = new BehaviorSubject<any>(this.user);
  constructor(private http: HttpClient) { }

  getUserById(id){
    return this.http.get(BACKEND_URL + '/profile/' + id).subscribe(userData => {
      this.userStorage.next(userData['user']);
    });
  }

}
