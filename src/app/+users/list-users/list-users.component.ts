import {Component, OnDestroy, OnInit} from '@angular/core';
import { UsersService } from '@app/+users/_services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  subscribeUsersList: Subscription;
  users = [];
  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getAllUsersInfo();
    this.subscribeUsersList = this.usersService.userListSubject.subscribe(usersList => {
      if (usersList) {
        console.log('userListSubject: ', usersList);
        this.users = usersList.slice(0);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscribeUsersList) { // this if will detect undefined issue of timersub
      this.subscribeUsersList.unsubscribe();
    }
  }
}
