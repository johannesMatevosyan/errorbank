import { Component, OnInit } from '@angular/core';
import { NotificationModel } from '@models/notification.model';
import { NotificationService } from '../_services/notification.service' ;
import { map } from 'rxjs/operators';

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
          map((res: { notifications: NotificationModel[] }) => res.notifications.map(notification => ({
            userId: notification.userId,
            postId: notification.postId['_id'],
            postTitle: notification.postId['title'],
            date: notification['createdAt'],
            commentId: notification.commentId['text'],
            type: 'comment',
            checked: notification['read'],
          })))
        )
        .subscribe((res: NotificationModel[]) => {
          this.notificationsArr = res;
        });
    // this.notificationsArr = [
    //   {
    //     userId: 'retdfgdfg51651s',
    //     postId: '26268484sadads1f2',
    //     postTitle: 'Rx Visualizer - Animated playground for Rx Observables',
    //     content: 'One remark: using Object.create() to create a "copy" of objects coming from an unbounded stream will produce an unbounded prototype chain',
    //     date: '29-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: true,
    //   },
    //   {
    //     userId: 'retdfgdfg51651s',
    //     postId: '26268484sadads1f2',
    //     postTitle: 'okokookokok',
    //     content: 'Software is Changing the World. QCon empowers software development by facilitating the spread of knowledge and innovation in the developer community',
    //     date: '30-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: false,
    //   },
    //   {
    //     userId: 'fdghghfgh3266',
    //     postId: 'tyuytu49hg4j94h',
    //     postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
    //     content: 'What Every Hipster Should Know About Functional Reactive Programming',
    //     date: '31-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: false,
    //   },
    //   {
    //     userId: 'fdghghfgh3266',
    //     postId: 'tyuytu49hg4j94h',
    //     postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
    //     content: 'What Every Hipster Should Know About Functional Reactive Programming',
    //     date: '31-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: true,
    //   },
    //   {
    //     userId: 'fdghghfgh3266',
    //     postId: 'tyuytu49hg4j94h',
    //     postTitle: 'RxEmber — an experimental set of helpers for Ember and RxJS',
    //     content: 'What Every Hipster Should Know About Functional Reactive Programming',
    //     date: '31-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: false,
    //   },
    //   {
    //     userId: 'retdfgdfg51651s',
    //     postId: '26268484sadads1f2',
    //     postTitle: 'okokookokok',
    //     content: 'Software is Changing the World. QCon empowers software development by facilitating the spread of knowledge and innovation in the developer community',
    //     date: '30-12-2019',
    //     commentId: '26268484sadads1f2',
    //     type: 'comment',
    //     checked: false,
    //   },
    // ];
  }
}
