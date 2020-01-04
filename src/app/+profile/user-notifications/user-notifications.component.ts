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
    this.notificationService.getNotifications();
    this.notificationService
      .notificationsList
      .subscribe((res: NotificationModel[]) => this.notificationsArr = res);
  }
}
