import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PostInfoService} from "@app/+dashboard/_services/post-info.service";
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
  @Input() userIntegrity;
  @Output() deletePostById = new EventEmitter<String>();
  alertModal = false;
  postId: string;
  numberOfComments = 0;
  numberOfViews = 0;
  subscription: Subscription;
  constructor(public postInfoService: PostInfoService, public dialog: MatDialog) { }

  ngOnInit() {
    this.postId = this.singlePost.id;
    this.numberOfViews = this.singlePost.viewed;
    if (this.postId) {
      this.getPostInfo(this.postId);
    }
  }

  getPostInfo(id: string) {
    this.subscription = this.postInfoService.postCommentedSubject.subscribe((response) => {
      if (response) {
        this.numberOfComments = response.commentsNumber;
      }
    });
    this.postInfoService.getPostCommentsInfoById(id);
  }

  deletePost(id) {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '300px',
      data: {message: 'Are you sure you want to delete this post?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.response) {
        this.deletePostById.emit(id);
      }
    });
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
