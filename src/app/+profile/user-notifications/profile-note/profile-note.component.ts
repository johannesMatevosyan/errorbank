import {Component, Input, OnInit} from '@angular/core';
import { NotificationService } from '@app/+profile/_services/notification.service';

@Component({
  selector: 'app-profile-note',
  templateUrl: './profile-note.component.html',
  styleUrls: ['./profile-note.component.css']
})
export class ProfileNoteComponent implements OnInit {
  @Input() note;
  constructor(
    private notificationService: NotificationService
  ) { 
  }

  ngOnInit() {
  }

  markRead(id) {
    this.notificationService.markRead(id);
  }

}
