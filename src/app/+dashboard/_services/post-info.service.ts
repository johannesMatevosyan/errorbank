import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { VoteModel } from '@models/vote.model';
import { FavModel } from '@models/fav.model';

const BACKEND_URL = environment.apiUrl + '/post/';
const BACKEND_USER_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class PostInfoService {

  votedForPostSubject = new Subject<any>();
  isFavouriteSubject = new Subject<any>();
  votedForCommentSubject = new Subject<any>();
  constructor(private http: HttpClient) { }

  voteForPost(vote) {
    this.http.post<VoteModel[]>(BACKEND_URL + 'vote', vote)
      .subscribe((responseData) => {
        this.votedForPostSubject.next(responseData);
      });
  }

  voteForComment(vote) {
    this.http.post<VoteModel[]>(BACKEND_URL + 'vote', vote)
      .subscribe((responseData) => {
        this.votedForCommentSubject.next(responseData);
      });
  }

  favoritePost(fav) {
    console.log(fav);
    this.http.post<FavModel>(BACKEND_USER_URL + 'posts/favourites/' + fav.postId, fav)
      .subscribe((responseData) => {
        console.log('favoritePost ', responseData);
      });
  }

}
