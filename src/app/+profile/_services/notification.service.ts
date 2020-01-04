import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '@env/environment';
import { Subject } from 'rxjs';
import { NotificationModel } from '@app/models/notification.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
      private http: HttpClient,
      private router: Router
  ) { }

  notificationsList = new Subject();

  getNotifications() {
    return this.http
      .get(BACKEND_URL + 'notifications')
      .pipe(
        map((res: { notifications: NotificationModel[] }) => res.notifications.map(notification => ({
          id: notification['_id'],
          userId: notification.userId,
          postId: notification.postId['_id'],
          postTitle: notification.postId['title'],
          date: notification['createdAt'],
          commentId: notification.commentId['text'],
          type: 'comment',
          checked: notification['read'],
        })))
      )
      .subscribe((notifications) => {
        this.notificationsList.next(notifications);
      });
  }

  markRead(note) {
    console.log('note', note)
    return this.http
      .get(BACKEND_URL + `notifications/read/${note.id}`)
      .subscribe(() => {
        this.router.navigateByUrl('/view/' + note.postId);
      });
  }
}
