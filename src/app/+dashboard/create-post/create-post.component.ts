import {Component, OnDestroy, OnInit} from '@angular/core';
import { PostModel } from '@models/post.model';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl} from '@angular/forms';
import { PostService } from '@app/+dashboard/_services/post.service';

import {extensionsArray} from '@app/+shared/utils/extensions';
import { CurrentDate } from '@utils/current-date';
import { ToastrService } from 'ngx-toastr';
import {Subscription} from "rxjs/index";
import {Router} from "@angular/router";
import {AlertComponent} from "@app/+shared/components/alert/alert.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  formSubmitAttempt = false;
  tagsList = [];
  clonedTagsArray = [];
  selectedTagsArray: FormArray;
  tag: string;
  string;
  createPostForm: FormGroup;
  imagePreview: string = '';
  subscription: Subscription;

  constructor(private fb: FormBuilder, private postService: PostService,
      private router: Router, private toastr: ToastrService, public dialog: MatDialog) { }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      image: new FormControl(null),
      created: new FormControl(null),
      updated: new FormControl('null'),
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
      this.tagsList.push({label: trim});

      if (this.clonedTagsArray.length <= 4) {
        this.clonedTagsArray.push({label: trim});
        this.addDynamicElement.push(this.fb.control({
          'label' : trim
        }));
      } else {

        const dialogRef = this.dialog.open(AlertComponent, {
          width: '300px',
          data: {
            message: 'You are not allowed to add more tags',
            type: 'tagLimit'
          }
        });

        dialogRef.afterClosed().subscribe(result => {});
      }

      this.tag = this.tagsList[this.tagsList.length-1];
      event.target.value = '';
      this.tagsList = [];
      this.string = '';
    }
  }

  onRemoveTags(filteredArrayOfTags){
    this.addDynamicElement.clear();
    filteredArrayOfTags.forEach(tag => {
      this.addDynamicElement.push(this.fb.group({label: tag.label}))
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const mimeTP = file.type;

    if (extensionsArray.indexOf(mimeTP) === -1) {
      alert('This file format is not accepted.');
      return;
    }
    this.createPostForm.patchValue({image: file});
    this.createPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.createPostForm.removeControl('image');
    this.createPostForm.addControl('image', new FormControl(''));
    this.createPostForm.controls['image'].patchValue({});
    this.imagePreview = '';
  }

  onSubmit() {

    let cd = new CurrentDate();

    this.createPostForm.controls['created'].setValue(cd.getCurrentDate());
    if (this.createPostForm.invalid) {
      return false;
    }

    this.formSubmitAttempt = true;

    if (this.createPostForm.status === 'VALID') {
      this.postService.create(this.createPostForm.value);
      this.subscription = this.postService.isSubmitted.subscribe((submission) => {
        if (submission) {
          this.toastr.success('Success!', 'Post created successfully');
          this.router.navigate(['/posts']);
        }
      });
    }

  }

  ngOnDestroy() {
    if(this.subscription){ // this if will detect undefined issue of timersub
      this.subscription.unsubscribe();
    }
  }

}
