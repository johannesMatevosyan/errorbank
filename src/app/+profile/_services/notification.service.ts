import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '@env/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
      private http: HttpClient
  ) { }

  getNotifications() {
    return this.http.get(BACKEND_URL + 'notifications');
  }
}
