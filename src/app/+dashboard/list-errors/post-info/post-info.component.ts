import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-post-info',
  templateUrl: './post-info.component.html',
  styleUrls: ['./post-info.component.css']
})
export class PostInfoComponent implements OnInit, OnChanges {
  @Input() numberOfVotes;
  @Input() numberOfComments;
  @Input() numberOfViews;
  comments;
  views;
  votes;
  constructor() { }

  ngOnInit() {
    if (this.numberOfVotes !== undefined) {
      this.votes = this.numberOfVotes;
    }
    if (this.numberOfComments !== undefined) {
      this.comments = this.numberOfComments;
    }
    if (this.numberOfViews !== undefined) {
      this.views = this.numberOfViews;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (this.numberOfComments !== undefined) {
    //   this.comments = this.numberOfComments;
    // }
    // if (this.numberOfViews !== undefined) {
    //   this.views = this.numberOfViews;
    // }
  }

}
