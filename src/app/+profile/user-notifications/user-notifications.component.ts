import { Component, OnInit } from '@angular/core';
import { NotificationModel } from '@models/notification.model';
import { NotificationService } from '../_services/notification.service' ;
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {
  notificationsArr: NotificationModel[] = [];
  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.getProfileNotifications();
  }

  getProfileNotifications() {
    this.notificationService
        .getNotifications()
        .pipe(
          tap(res => console.log(res)),
          map((res: { notifications: NotificationModel[] }) => res.notifications.map(notification => ({
            userId: notification.userId,
            postId: notification.postId['_id'],
            postTitle: notification.postId['title'],
            date: notification['createdAt'],
            commentId: notification.commentId['text'],
            type: 'comment',
            checked: notification['read'],
          }))),
          tap(res => console.log(res)),
        )
        .subscribe((res: NotificationModel[]) => {
          this.notificationsArr = res;
        });
  }
}
