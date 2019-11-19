import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "@app/+dashboard/_services/post.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";
import {CommentService} from "@app/+shared/_services/comment.service";
import {CommentModel} from "@models/comment.model";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  post: PostModel;
  postId: string = '75757575';
  comment: CommentModel;
  postInfo = {
    postId : '',
    userId : ''
  };
  constructor(private postService: PostService,
              private activatedRoute: ActivatedRoute, private commentService: CommentService) { }

  ngOnInit() {
    this.getSinglePost();
    this.getComment();
    this.getCommentByPost(this.postId);
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
    this.commentService.saveComment(comment);
  }

  getComment(){
    this.subscription = this.commentService.commentSubject.subscribe((response) => {

      if (response) {
        this.comment = response;
      }
    });
  }

  getCommentByPost(post) {
    this.activatedRoute.params.subscribe(paramsId => {
      if (paramsId.id) {
        this.commentService.getCommentsByPostID(paramsId.id);
        this.subscription = this.commentService.commentsSubject.subscribe((response) => {
          if(response){
            console.log('this.commentService.commentsSubject  : ', response);
          }
        });
      }
    });

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
