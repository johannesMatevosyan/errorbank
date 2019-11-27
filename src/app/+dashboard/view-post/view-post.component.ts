import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "@app/+dashboard/_services/post.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";
import {CommentService} from "@app/+shared/_services/comment.service";
import {CommentModel} from "@models/comment.model";
import {PostInfoService} from "@app/+dashboard/_services/post-info.service";
import {AuthService} from "@app/+shared/_services/auth.service";
import {CurrentDate} from "@utils/current-date";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  userIntegrity;
  post: PostModel;
  comment: CommentModel;
  commentsArray: CommentModel[];
  postInfo = {
    postId : '',
    userId : ''
  };
  votesDiff;
  constructor(private postService: PostService,
              private activatedRoute: ActivatedRoute,
              private postInfoService: PostInfoService,
              public authService: AuthService,
              private commentService: CommentService) { }

  ngOnInit() {
    this.getSinglePost();
    this.getComment();
    this.getCommentByPost();
    this.getUserId();
  }

  getSinglePost() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postSubject.subscribe((response) => {
        if (response) {
          console.log('getSinglePost ', response.voteId.votes);
          const votesDiffObj = response.voteId.votes.reduce((obj, v) => {
            // return obj[v.type]++;
            if (v.type === 'up') {
              obj['up']++;
            } else {
              obj['down']++;
            }
            return obj;
          }, { 'up': 0, 'down': 0 });
          console.log('votesDiff ', votesDiffObj);


          this.post = response;
          this.postInfo.postId = response._id;
          this.postInfo.userId = response.author._id;
          this.votesDiff = votesDiffObj.up - votesDiffObj.down;
        }

      });
    });
  }

  onPostComment(comment) {
    this.commentService.saveComment(comment);
    this.commentsArray.push(comment);
  }

  getComment(){
    this.subscription = this.commentService.commentSubject.subscribe((response) => {
      if (response) {
        this.comment = response;
      }
    });
  }

  getCommentByPost() {
    this.activatedRoute.params.subscribe(paramsId => {
      if (paramsId.id) {
        this.commentService.getCommentsByPostID(paramsId.id);
        this.subscription = this.commentService.commentsSubject.subscribe((response) => {
          if(response){
            this.commentsArray = response;
          }
        });
      }
    });

  }

  getUserId() {
    this.subscription = this.authService.userIdentitySubject.subscribe(userId => {
      if (userId) {
        console.log('getUserId  : ', userId);
        this.userIntegrity = userId;
      }
    });
  }

  vote(status: string, userId: string) {
    if (!userId) {
      alert('Please login to vote.');
      return;
    }
    this.activatedRoute.params.subscribe(paramsId => {
      if (paramsId.id) {
        let cd = new CurrentDate();
        let vote = {type: status, postId: paramsId.id, userId: userId, date: cd.getCurrentDate()};
        this.postInfoService.voteForPost(vote);
      }
    });

  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
