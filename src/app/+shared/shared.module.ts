import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from "@app/angular-material.module";
import { RouterModule, Routes } from '@angular/router';
import { PaginationComponent } from '@app/+shared/components/pagination/pagination.component';
import { PostInfoComponent } from '@app/+shared/components/post-info/post-info.component';
import { TagComponent } from '@app/+shared/components/tag/tag.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';

@NgModule({
  declarations: [PaginationComponent, PostInfoComponent, TagComponent, CommentComponent, CommentBoxComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
  ],
  exports: [PaginationComponent, PostInfoComponent, TagComponent, CommentComponent, CommentBoxComponent],
})
export class SharedModule { }
