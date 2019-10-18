import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PostService} from '@app/+dashboard/services/post.service';
import {Subscription} from 'rxjs/index';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  editPostForm: FormGroup;
  subscription: Subscription;
  post;

  constructor(private fb: FormBuilder, private postService: PostService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.editPostForm = this.fb.group({
      id: [''],
      title: [''],
      content: [''],
    });
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postsSubject.subscribe(response => {
        console.log('editable paramsId.id ', paramsId.id);
        console.log('editable post ', response);
        this.post = response;
        this.editPostForm.controls['id'].setValue(paramsId.id ? paramsId.id : '');
        this.editPostForm.controls['title'].setValue(this.post.title ? this.post.title : '');
        this.editPostForm.controls['content'].setValue(this.post.content ? this.post.content : '');
      });
    });

  }

  onSubmit() {
    if (this.editPostForm.invalid) {
      return false;
    }
    const postId = this.editPostForm.controls['id'].value;
    const post = {
      title: this.editPostForm.controls['title'].value,
      content: this.editPostForm.controls['content'].value,
    }
    this.postService.updatePostById(postId, this.editPostForm.value);
  }

}
