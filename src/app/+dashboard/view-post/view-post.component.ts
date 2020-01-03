import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '@app/+dashboard/_services/post.service';
import {Subscription} from 'rxjs/index';
import {PostModel} from '@models/post.model';
import {CommentService} from '@app/+shared/_services/comment.service';
import {CommentModel} from '@models/comment.model';
import {PostInfoService} from '@app/+dashboard/_services/post-info.service';
import {AuthService} from '@app/+shared/_services/auth.service';
import {CheckVote} from '@utils/check-vote';
import {CurrentDate} from '@utils/current-date';
import {AlertComponent} from '@app/+shared/components/alert/alert.component';
import {MatDialog} from '@angular/material';
import {ProfileService} from '@app/+profile/_services/profile.service';
import {ToastrService} from 'ngx-toastr';

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
  favPostsIdArray = [];
  postInfo = {
    postId : '',
    authorId : ''
  };
  votesDiff;
  userIsAuthenticated = false;
  authStatusSub: Subscription;
  subscribeUser: Subscription;
  constructor(private postService: PostService,
              private activatedRoute: ActivatedRoute,
              private postInfoService: PostInfoService,
              public authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              private commentService: CommentService,
              private profileService: ProfileService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getUserId();
    this.getSinglePost();
    this.getComment();
    this.getCommentByPost();
    this.getFavoritePosts();
    this.checkAuthenticationStatus();
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
          userId: userId['userId'],
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
    };
    this.postInfoService.favoritePost(data);
  }

  getFavoritePosts() {
    this.profileService.getUserInfoById(this.userIntegrity.userId);
    this.subscribeUser = this.profileService.usersFavoritePostIds.subscribe(posts => {
      if (posts) {
        this.favPostsIdArray = posts.slice(0);

        this.activatedRoute.params.subscribe(paramsId => {
          this.postService.getPostById(paramsId.id);
          const found = this.favPostsIdArray.includes(paramsId.id);
          if (found) {
            this.favType = true;
          } else {
            this.favType = false;
          }
        });

      }

    });
  }

  checkAuthenticationStatus() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      },error => {
        console.error('error: ', error);
      }, () => {
        console.log('onCompleted');
      });

  }

  deletePost(id) {
    this.postService.delete(id).subscribe(response => {
      if (response) {
        this.toastr.success('Success!', 'Post deleted successfully ');
        this.router.navigate(['/posts']);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) { // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
