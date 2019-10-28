import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostModel } from '@models/post.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PostService } from '@app/+dashboard/services/post.service';
import { CurrentDate } from '@utils/current-date';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  tagsList = [];
  selectedTagsArray: FormArray;
  tag:string;
  string;
  createPostForm: FormGroup;
  subscription: Subscription;

  constructor(private fb: FormBuilder, private postService: PostService) { }

  ngOnInit() {
    this.createPostForm = this.fb.group({
      title: [''],
      content: [''],
      date: [''],
      tagsArray: this.fb.array([]),
    });
    this.selectedTagsArray = this.createPostForm.get('tagsArray') as FormArray;
  }
  get addDynamicElement() {
    return this.createPostForm.get('tagsArray') as FormArray
  }

  addTag(event) {
    this.string = event.target.value.replace(/\s/g, "");
    if(event.key === ',') {
      let trim = this.string.replace(/,/g, '');
      this.tagsList.push({name: trim});
      this.addDynamicElement.push(this.fb.control({
        'tagname' : trim
      }));
      this.tag = this.tagsList[this.tagsList.length-1];
      event.target.value = '';
      this.tagsList = [];
      this.string = '';

    }
  }
  onRemoveTags(event){
    console.log('onRemoveTags  : ', event);
    console.log('this.addDynamicElement : ', this.addDynamicElement);

  }

  onSubmit() {
    console.log('this.createPostForm.value ', this.createPostForm.value);

    let cd = new CurrentDate();

    console.log('cd.getCurrentDate() ', cd.getCurrentDate());
    this.createPostForm.controls['date'].setValue(cd.getCurrentDate());
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
