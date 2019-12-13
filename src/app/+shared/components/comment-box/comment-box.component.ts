import {Component, Input, OnInit} from '@angular/core';
import {CurrentDate} from "@utils/current-date";
import {PostInfoService} from "@app/+dashboard/_services/post-info.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "@app/+shared/_services/auth.service";
import {Subscription} from "rxjs/index";
import {CheckVote} from "@utils/check-vote";
import {PostService} from "@app/+dashboard/_services/post.service";
import {AlertComponent} from "@app/+shared/components/alert/alert.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {
  @Input() singleComment;
  subscription: Subscription;
  userIntegrity;
  voteInfo;
  votesDiff = 0;
  postInfo = {
    postId : '',
    userId : ''
  };
  constructor(private activatedRoute: ActivatedRoute,
              private postService: PostService,
              private postInfoService: PostInfoService,
              public dialog: MatDialog,
              public authService: AuthService,) { }

  ngOnInit() {
    this.getSingleComment();
    this.getUserId();
  }

  getSingleComment() {
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

  getUserId() {
    this.subscription = this.authService.userIdentitySubject.subscribe(userId => {
      if (userId) {
        this.userIntegrity = userId;
      }
    });
  }

  vote(status: string, userId: string, relatedTo: string) {
    console.log('vote form comment');
    if (!userId) {
      const dialogRef = this.dialog.open(AlertComponent, {
        width: '300px',
        data: {
          message: 'Please login to vote',
          type: 'notAuthorized'
        }
      });
      dialogRef.afterClosed().subscribe(result => {});

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
        this.postInfoService.voteForComment(vote);
        this.postInfoService.votedForCommentSubject.subscribe((response) => {

          const votesDiffObj = response.post.voteId ? response.post.voteId.votes.reduce((obj, v) => {
            if (v.type === 'up') {
              obj['up']++;
            } else {
              obj['down']++;
            }
            return obj;
          }, { 'up': 0, 'down': 0 }) : { 'up': 0, 'down': 0 };

          this.votesDiff = votesDiffObj.up - votesDiffObj.down;

          if (response.post.voteId) {
            let cv = new CheckVote();
            this.voteInfo = cv.getCheckedVote(response.post.voteId.votes, this.userIntegrity);
          }
        });
      }
    });

  }
}
