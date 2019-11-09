import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {PostService} from '@app/+dashboard/_services/post.service';
import {Subscription} from 'rxjs/index';
import {ActivatedRoute} from "@angular/router";
import {CurrentDate} from "@utils/current-date";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy {
  editPostForm: FormGroup;
  subscription: Subscription;
  tagsList = [];
  clonedTagsArray = [];
  tag: string;
  string;
  created: string;
  imagePreview;
  post;

  constructor(private fb: FormBuilder, private postService: PostService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.editPostForm = this.fb.group({
      id: [''],
      title: [''],
      content: [''],
      image: [''],
      created: [''],
      updated: [''],
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
      this.subscription = this.postService.postsSubject.subscribe(response => {
        console.log('response ', response);
        this.post = response;
        this.editPostForm.controls['id'].setValue(paramsId.id ? paramsId.id : '');
        this.editPostForm.controls['title'].setValue(this.post.title ? this.post.title : '');
        this.editPostForm.controls['content'].setValue(this.post.content ? this.post.content : '');
        this.editPostForm.controls['created'].setValue(this.post.created ? this.post.created : '');
        this.imagePreview = this.post.imagePath ? this.post.imagePath : '';
        this.created = this.post.created;
        let tags = this.post.tags.map(item => {
          return {name: item.name};
        });
        console.log('tags : ', tags);
        this.editPostForm.setControl('tagsArray', this.fb.array(tags || []));
      });
    });
  }

  addTag(event) {
    this.string = event.target.value.replace(/\s/g, "");
    if(event.key === ',') {
      let trim = this.string.replace(/,/g, '');
      this.tagsList.push({name: trim});
      this.clonedTagsArray.push({name: trim});
      this.tagsFormArray.push(this.fb.control({
        'name' : trim
      }));
      this.tag = this.tagsList[this.tagsList.length-1];
      event.target.value = '';
      this.tagsList = [];
      this.string = '';
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editPostForm.patchValue({image: file});
    this.editPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.editPostForm.invalid) {
      return false;
    }

    let cd = new CurrentDate();
    const postId = this.editPostForm.controls['id'].value;
    this.editPostForm.controls['updated'].setValue(cd.getCurrentDate());
    console.log('this.editPostForm.value : ', this.editPostForm.value);
    this.postService.updatePostById(postId, this.editPostForm.value);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
