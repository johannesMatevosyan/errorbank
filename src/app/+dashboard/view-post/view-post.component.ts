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
import {AlertComponent} from "@app/+shared/components/alert/alert.component";
import {MatDialog} from "@angular/material";

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
  favType: boolean = false;
  post: PostModel;
  comment: CommentModel;
  commentsArray: CommentModel[];
  clonedTagsArray = [];
  postInfo = {
    postId : '',
    authorId : ''
  };
  votesDiff;
  constructor(private postService: PostService,
              private activatedRoute: ActivatedRoute,
              private postInfoService: PostInfoService,
              public authService: AuthService,
              public dialog: MatDialog,
              private commentService: CommentService) { }

  ngOnInit() {
    this.getUserId();
    this.getSinglePost();
    this.getComment();
    this.getCommentByPost();
  }

  getSinglePost() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postSubject.subscribe((response) => {
        if (response) {
          this.post = response;
          this.clonedTagsArray = this.post.tags;
          this.postInfo.postId = response._id;
          this.postInfo.authorId = response.author._id;
          this.countVotes(response.voteId);

        }

      });
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
      this.voteInfo = cv.getCheckedVote(votesArr.votes, this.userIntegrity.userId);
    }
  }

  onPostComment(comment) {
    this.commentService.saveComment(comment);
    this.commentService.commentSubject.subscribe((commentResponse) => {
      if (commentResponse) {
        this.commentsArray.push(commentResponse);
      }
    });

  }

  getComment() {
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
        this.subscription = this.commentService.commentsSubject.subscribe((commentResponse) => {
          if (commentResponse) {
            this.commentsArray = commentResponse;
          }
        });
      }
    });

  }

  getUserId() {
    this.subscription = this.authService.userIdentitySubject.subscribe(userData => {
      if (userData) {
        this.userIntegrity = userData;
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
          docId: paramsId.id as string,
          userId: userId,
          relatedTo: relatedTo,
          date: cd.getCurrentDate()
        };
        this.postInfoService.voteForPost(vote);
        this.postInfoService.votedForPostSubject.subscribe((response) => {
          if (response) {
            this.countVotes(response.post.voteId);
          }
        });
      }
    });

  }

  favoritePost(postIdentity, userIdentity) {
    this.favType = !this.favType;
    let data = {
      postId: postIdentity,
      userId: userIdentity,
      isFavourite: this.favType
    };
    this.postInfoService.favoritePost(data);
    this.postInfoService.isFavouriteSubject.subscribe((response) => {
      if (response) {
        console.log('isFavouriteSubject ', response);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) { // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
