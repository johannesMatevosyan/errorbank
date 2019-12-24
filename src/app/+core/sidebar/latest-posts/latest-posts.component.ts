import {Component, OnDestroy, OnInit} from '@angular/core';
import {CoreService} from "@app/+core/_services/core.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";

@Component({
  selector: 'app-latest-posts',
  templateUrl: './latest-posts.component.html',
  styleUrls: ['./latest-posts.component.css']
})
export class LatestPostsComponent implements OnInit, OnDestroy {
  postsByDate: PostModel[] = [];
  subscription: Subscription;
  constructor(private coreService: CoreService) { }

  ngOnInit() {
    this.coreService.getAllByDate();
    this.subscription = this.coreService.postsSubject.subscribe(response => {
      this.postsByDate = response;
    });
  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }
}
