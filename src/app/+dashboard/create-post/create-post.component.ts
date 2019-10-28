import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostModel } from '@models/post.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PostService } from '@app/+dashboard/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  tagArray = [];
  tag:string;
  string;
  createPostForm: FormGroup;
  subscription: Subscription;

  constructor(private fb: FormBuilder, private postService: PostService) { }

  ngOnInit() {
    this.createPostForm = this.fb.group({
      title: [''],
      content: [''],
      tags: [''],
    });
  }

  addPost(event) {
    this.string = event.target.value.replace(/\s/g, "");
    if(event.key === ',') {
      this.tagArray.push(this.string.replace(/,/g, ''));
      this.tag = this.tagArray[this.tagArray.length-1];
      event.target.value = '';
      this.tagArray = [];
      this.string = '';

    }
  }

  onSubmit() {
    if (this.createPostForm.invalid) {
      return false;
    }
    this.postService.create(this.createPostForm.value);
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
