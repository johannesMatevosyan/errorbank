import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostModel } from '@models/post.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PostService } from '@app/+dashboard/_services/post.service';
import { CurrentDate } from '@utils/current-date';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  tagsList = [];
  clonedTagsArray = [];
  selectedTagsArray: FormArray;
  tag:string;
  string;
  createPostForm: FormGroup;
  subscription: Subscription;
  imagePreview: string;

  constructor(private fb: FormBuilder, private postService: PostService, private toastr: ToastrService) { }

  ngOnInit() {
    this.createPostForm = this.fb.group({
      title: [''],
      content: [''],
      image: [''],
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
      this.clonedTagsArray.push({name: trim});
      this.addDynamicElement.push(this.fb.control({
        'name' : trim
      }));
      this.tag = this.tagsList[this.tagsList.length-1];
      event.target.value = '';
      this.tagsList = [];
      this.string = '';

    }
  }

  onRemoveTags(filteredArrayOfTags){
    this.addDynamicElement.clear();
    filteredArrayOfTags.forEach(tag => {
      this.addDynamicElement.push(this.fb.group({name: tag.name}))
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.createPostForm.patchValue({image: file});
    this.createPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    console.log('this.createPostForm.value : ', this.createPostForm.value);
    this.toastr.success('AAAAAAAAA!', 'Toastr fun!');
    let cd = new CurrentDate();

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
