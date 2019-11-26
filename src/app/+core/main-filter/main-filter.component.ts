import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "@app/+core/_services/core.service";
import {Subscription} from "rxjs/index";
import {SearchFilterService} from "@app/+shared/_services/search-filter.service";

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.css']
})
export class MainFilterComponent implements OnInit, OnDestroy {
  dateSort = 1;
  likeSort = 1;
  commentSort = 1;
  tagsArray;
  subscription: Subscription;
  constructor(private coreService: CoreService, private sfService: SearchFilterService) { }

  ngOnInit() {
    this.getAllTags();
  }

  getAllTags() {
    this.coreService.getTags();
    this.subscription = this.coreService.tagsSubject.subscribe(response => {
      this.tagsArray = response;
    });
  }

  sortPostsByDate() {
    console.log('sortPostsByDate 1 : ', this.dateSort);
    this.dateSort = this.dateSort * (-1);
    console.log('sortPostsByDate 2 : ', this.dateSort);
    this.sfService.sortByDate(this.dateSort);
  }

  sortPostsByLikes() {
    console.log('sortPostsByLikes 1 : ', this.likeSort);
    this.likeSort = this.likeSort * (-1);
    console.log('sortPostsByLikes 2 : ', this.likeSort);
    this.sfService.sortByLikes(this.likeSort);
  }

  sortPostsByCommentCount() {
    console.log('sortPostsByLikes 1 : ', this.commentSort);
    this.commentSort = this.commentSort * (-1);
    console.log('sortPostsByLikes 2 : ', this.commentSort);
    this.sfService.sortByCommentCount(this.commentSort);
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
