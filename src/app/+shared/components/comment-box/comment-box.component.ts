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
import {CommentService} from '@services/comment.service';

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
  constructor(private activatedRoute: ActivatedRoute,
              private postService: PostService,
              private postInfoService: PostInfoService,
              private commentService: CommentService,
              public dialog: MatDialog,
              public authService: AuthService) { }

  ngOnInit() {
    this.getUserId();
    this.getSingleComment();
  }

  getSingleComment() {

    this.subscription = this.postInfoService.votedForCommentSubject.subscribe((response) => {

      if (this.singleComment._id !== response.post._id) {
        return;
      }
      this.countVotes(response.post.voteId);

    });


  }

  countVotes(votesArr) {
    const votesDiffObj = votesArr ? votesArr.votes.reduce((obj, v) => {
      if (v.type === 'up') {
        obj['up']++;
      } else {
        obj['down']++;
      }
      return obj;
    }, { 'up': 0, 'down': 0 }) : { 'up': 0, 'down': 0 };

    this.votesDiff = votesDiffObj.up - votesDiffObj.down;

    if (votesArr) {
      let cv = new CheckVote();
      this.voteInfo = cv.getCheckedVote(votesArr.votes, this.userIntegrity);
    }
  }

  getUserId() {
    this.subscription = this.authService.userIdentitySubject.subscribe(userId => {
      if (userId) {
        this.userIntegrity = userId;
        this.countVotes(this.singleComment.voteId);
      }
    });
  }

  vote(status: string, userId: string, relatedTo: string) {

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
          docId: this.singleComment._id as string,
          userId: userId['userId'],
          relatedTo: relatedTo,
          date: cd.getCurrentDate()
        };

        this.postInfoService.voteForComment(vote);
      }
    });

  }

  removeComment(id: string) {
    this.commentService.deleteComment(id);
  }
}
