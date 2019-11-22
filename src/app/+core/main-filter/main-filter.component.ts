import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "@app/+core/_services/core.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.css']
})
export class MainFilterComponent implements OnInit, OnDestroy {
  tagsArray;
  subscription: Subscription;
  constructor(private coreService: CoreService) { }

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

  }

  sortPostsByLikes() {

  }

  sortPostsByCommentCount() {

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
