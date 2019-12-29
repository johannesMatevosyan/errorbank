import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs/index';
import {environment} from '@env/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userListSubject = new Subject<any>();
  constructor(private http: HttpClient) { }

  getAllUsersInfo() {
    this.http.get(BACKEND_URL + 'list-info')
      .subscribe(response => {
        if (response) {
          this.userListSubject.next(response);
        }
      });
  }

  getAllUsers() {
    this.http.get(BACKEND_URL + 'list-info')
      .subscribe(response => {
      });
  }

}
