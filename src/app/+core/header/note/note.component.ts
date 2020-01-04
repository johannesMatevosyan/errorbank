import {Component, Input, OnInit} from '@angular/core';
import {NotificationService} from '@app/+profile/_services/notification.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  @Input() note;
  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  markNotificationRead(id) {
    this.notificationService.markRead(id);
  }

}
