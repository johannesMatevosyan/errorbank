import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { CurrentDate } from '@utils/current-date';
import {CommentService} from '@services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postInfo;
  @Input() userData;
  @Output() sendComment: EventEmitter<any> = new EventEmitter();
  @ViewChild('comment', {static: false}) comment: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  postComment(text) {
    let cd = new CurrentDate();
    let comment = {
      text: text,
      postId: this.postInfo.postId,
      userId: this.userData.userId,
      date: cd.getCurrentDate()
    };
    this.sendComment.emit(comment);
    this.comment.nativeElement.value = '';
  }

}
