import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs/index';
import { map } from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import { ProfileService } from '../_services/profile.service';

@Component({
  selector: 'app-user-favorite-posts',
  templateUrl: './user-favorite-posts.component.html',
  styleUrls: ['./user-favorite-posts.component.css']
})
export class UserFavoritePostsComponent implements OnInit, OnDestroy {
  userFavouritePosts = [];
  subscribeUser: Subscription;
  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute
      .params
      .subscribe(params => {
        this.profileService.getFavPostsUserById(params.id);
        this.subscribeUser = this.profileService
          .userFavorites
          .pipe(
            map(data => data && data.map(post => {
              if (!post['voteObj'] || !post['voteObj']['votes']) {
                post.computedVote = 0;
                return post;
              }
              let votes = 0;
              post['voteObj']['votes'].forEach(vote => {
                if (vote.type === 'down') {
                  votes--;
                } else {
                  votes++;
                }
              });
              post.computedVote = votes;
              return post;
            }))
          )
          .subscribe(userPosts => {
            if (userPosts) {
              this.userFavouritePosts = userPosts.slice(0);
            }
          });
      });
  }

  ngOnDestroy() {
    this.subscribeUser.unsubscribe();
  }

}
