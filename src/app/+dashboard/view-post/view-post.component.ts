import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "@app/+dashboard/_services/post.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";
import {CommentService} from "@app/+shared/_services/comment.service";
import {CommentModel} from "@models/comment.model";
import {PostInfoService} from "@app/+dashboard/_services/post-info.service";
import {AuthService} from "@app/+shared/_services/auth.service";
import {CheckVote} from "@utils/check-vote";
import {CurrentDate} from "@utils/current-date";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  userIntegrity = null;
  isUserVoted;
  voteInfo;
  post: PostModel;
  comment: CommentModel;
  commentsArray: CommentModel[];
  clonedTagsArray = [];
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
          console.log('response ', response);
          const votesDiffObj = response.voteId ? response.voteId.votes.reduce((obj, v) => {
            if (v.type === 'up') {
              obj['up']++;
            } else {
              obj['down']++;
            }
            return obj;
          }, { 'up': 0, 'down': 0 }) : { 'up': 0, 'down': 0 };

          this.post = response;
          this.clonedTagsArray = this.post.tags;
          this.postInfo.postId = response._id;
          this.postInfo.userId = response.author._id;
          this.votesDiff = votesDiffObj.up - votesDiffObj.down;

          if (response.voteId) {
            let cv = new CheckVote();
            this.voteInfo = cv.getCheckedVote(response.voteId.votes, this.userIntegrity);
          }

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
        this.userIntegrity = userId;
      }
    });
  }

  vote(status: string, userId: string, relatedTo: string) {
    if (!userId) {
      alert('Please login to vote.');
      return;
    }
    this.activatedRoute.params.subscribe(paramsId => {
      if (paramsId.id) {
        let cd = new CurrentDate();
        let vote = {
          type: status as ('up' | 'down'),
          postId: paramsId.id as string,
          userId: userId,
          relatedTo: relatedTo,
          date: cd.getCurrentDate()
        };
        this.postInfoService.voteForPost(vote);
        this.postInfoService.votedForPostSubject.subscribe((response) => {

          const votesDiffObj = response.post.voteId ? response.post.voteId.votes.reduce((obj, v) => {
            if (v.type === 'up') {
              obj['up']++;
            } else {
              obj['down']++;
            }
            return obj;
          }, { 'up': 0, 'down': 0 }) : { 'up': 0, 'down': 0 };

          this.votesDiff = votesDiffObj.up - votesDiffObj.down;

          if (response.voteId) {
            console.log('response **************', response);
            let cv = new CheckVote();
            this.voteInfo = cv.getCheckedVote(response.voteId.votes, this.userIntegrity);
          }

        });
      }
    });

  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
