import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PostInfoService} from "@app/+dashboard/_services/post-info.service";
import {Subscription} from "rxjs/index";

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
  postId: string;
  numberOfComments = 0;
  numberOfViews = 0;
  subscription: Subscription;
  constructor(public postInfoService: PostInfoService) { }

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
    this.deletePostById.emit(id);
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
