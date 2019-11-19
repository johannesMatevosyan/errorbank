import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "@app/+dashboard/_services/post.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";
import {CommentService} from "@app/+shared/_services/comment.service";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  post: PostModel;
  postInfo = {
    postId : '',
    userId : ''
  };
  constructor(private postService: PostService,
              private activatedRoute: ActivatedRoute, private commentService: CommentService) { }

  ngOnInit() {
    this.getSinglePost();
  }

  getSinglePost() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postSubject.subscribe((response) => {
        console.log('response *********** ', response);
        if (response) {
          this.post = response;
          this.postInfo.postId = response._id;
          this.postInfo.userId = response.author.name;
        }

      });
    });
  }

  onPostComment(comment) {
    console.log('onPostComment', comment);
    this.commentService.saveComment(comment);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
