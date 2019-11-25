import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostService} from '@app/+dashboard/_services/post.service';
import {Subscription} from 'rxjs/index';
import {ActivatedRoute} from "@angular/router";
import {CurrentDate} from "@utils/current-date";
import {extensionsArray} from "@utils/extensions";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  formSubmitAttempt = false;
  editPostForm: FormGroup;
  subscription: Subscription;
  tagsList = [];
  clonedTagsArray = [];
  tag: string;
  string;
  created: string;
  imagePreview;
  post;

  constructor(private fb: FormBuilder, private postService: PostService,
              private activatedRoute: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.editPostForm =  new FormGroup({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      content: new FormControl('', [Validators.required, Validators.minLength(6)]),
      image: new FormControl(''),
      created: new FormControl(''),
      updated: new FormControl(''),
      tagsArray: this.fb.array([]),
    });
    this.loadPostById();
  }

  get tagsFormArray() {
    return this.editPostForm.get('tagsArray') as FormArray
  }

  loadPostById() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.postService.getPostById(paramsId.id);
      this.subscription = this.postService.postSubject.subscribe(response => {
        console.log('editPostForm ', response);
        this.post = response;
        this.editPostForm.controls['id'].setValue(paramsId.id ? paramsId.id : '');
        this.editPostForm.controls['title'].setValue(this.post.title ? this.post.title : '');
        this.editPostForm.controls['content'].setValue(this.post.content ? this.post.content : '');
        this.editPostForm.controls['created'].setValue(this.post.created ? this.post.created : '');
        this.clonedTagsArray = this.post.tags;
        this.imagePreview = this.post.imagePath ? this.post.imagePath : '';
        this.created = this.post.created;
        if (this.post.tags) {
          let filterTagsArray = this.post.tags.map(item => {
            return {label: item.label};
          });
          this.editPostForm.setControl('tagsArray', this.fb.array(filterTagsArray || []));
        }

      });
    });
  }

  addTag(event) {
    this.string = event.target.value.replace(/\s/g, "");
    if(event.key === ',') {
      let trim = this.string.replace(/,/g, '');
      this.tagsList.push({label: trim});
      this.clonedTagsArray.push({label: trim});
      this.tagsFormArray.push(this.fb.control({
        'label' : trim
      }));
      this.tag = this.tagsList[this.tagsList.length-1];
      event.target.value = '';
      this.tagsList = [];
      this.string = '';
    }
  }

  onRemoveTags(filteredArrayOfTags){
    this.tagsFormArray.clear();
    filteredArrayOfTags.forEach(tag => {
      this.tagsFormArray.push(this.fb.group({label: tag.label}))
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const mimeTP = file.type;

    if (extensionsArray.indexOf(mimeTP) === -1) {
      alert('This file format is not accepted.');
      return;
    }
    this.editPostForm.patchValue({image: file});
    this.editPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {

    let cd = new CurrentDate();
    const postId = this.editPostForm.controls['id'].value;
    this.editPostForm.controls['updated'].setValue(cd.getCurrentDate());

    this.formSubmitAttempt = true;

    if (this.editPostForm.status) {
      this.postService.updatePostById(postId, this.editPostForm.value);
      this.subscription = this.postService.isSubmitted.subscribe((submission) => {
        console.log('isSubmitted ', submission);
        if (submission) {
          this.toastr.success('Success!', 'Post updated successfully ');
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
