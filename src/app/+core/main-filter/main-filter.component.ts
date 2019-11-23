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
    this.sfService.sortByDate();
  }

  sortPostsByLikes() {
    this.sfService.sortByLikes();
  }

  sortPostsByCommentCount() {
    this.sfService.sortByCommentCount();
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
