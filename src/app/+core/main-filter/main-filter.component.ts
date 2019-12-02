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
    this.addTagToFilter();
  }

  getAllTags() {
    this.coreService.getTags();
    this.subscription = this.coreService.tagsSubject.subscribe(response => {
      this.tagsArray = response;
    });
  }

  sortPostsByDate() {
    this.dateSort = this.dateSort * (-1);
    this.sfService.sortByDate(this.dateSort);
  }

  sortPostsByLikes() {
    this.likeSort = this.likeSort * (-1);
    this.sfService.sortByLikes(this.likeSort);
  }

  sortPostsByCommentCount() {
    this.commentSort = this.commentSort * (-1);
    this.sfService.sortByCommentCount(this.commentSort);
  }

  onAddTagToList(tag) {
    this.tagsArray = this.tagsArray.filter(item => {
      return item.label !== tag.label;
    });
  }

  onRemoveTagFromList(tag) {
    this.tagsArray = this.tagsArray.filter(item => {
      return item.label !== tag.label;
    });
  }

  addTagToFilter() {
    this.sfService.tagObject.subscribe(tag => {
      if (tag) {
        this.tagsArray.push(tag);
      }
    });
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
