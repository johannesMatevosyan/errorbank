import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs/index";
import {MatDialog} from "@angular/material";
import {AlertComponent} from "@app/+shared/components/alert/alert.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() singlePost;
  @Input() userIsAuthenticated;
  @Output() deletePostById = new EventEmitter<String>();
  postId: string;
  votes = 0;
  subscription: Subscription;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.postId = this.singlePost.id;
    let voteObj = this.singlePost.voted;
    if (voteObj) {
      if (Object.keys(voteObj).length > 0) {
        this.votes = voteObj.votes.length;
      } else {
        this.votes = 0;
      }
    }

  }

  deletePost(id) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to delete this post?',
        type: 'confirmDelete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.response) {
        this.deletePostById.emit(id);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) { // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
