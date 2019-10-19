import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PostService} from "@app/+dashboard/services/post.service";
import {Subscription} from "rxjs/index";
import {PostModel} from "@models/post.model";

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  editPostForm: FormGroup;
  subscription: Subscription;
  post;
  result;
  constructor(private postService: PostService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postsSubject.subscribe(response => {
console.log('response', response);
        this.result = response;
        this.post.title = this.result.title ? this.result.title : '';
        this.post.content = this.result.content ? this.result.content : '';
      });
    });

  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
