import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile-note',
  templateUrl: './profile-note.component.html',
  styleUrls: ['./profile-note.component.css']
})
export class ProfileNoteComponent implements OnInit {
  @Input() note;
  constructor() { }

  ngOnInit() {
    console.log('this.note ', this.note);
  }

}
