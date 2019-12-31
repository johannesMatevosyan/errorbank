import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '@app/angular-material.module';
import { RouterModule, Routes } from '@angular/router';
import { PaginationComponent } from '@app/+shared/components/pagination/pagination.component';
import { TagComponent } from '@app/+shared/components/tag/tag.component';
import { CommentComponent } from '@app/+shared/components/comment/comment.component';
import { CommentBoxComponent } from '@app/+shared/components/comment-box/comment-box.component';
import { ErrorComponent } from '@app/+shared/components/error/error.component';
import { AlertComponent } from '@app/+shared/components/alert/alert.component';
import { ClickOutsideDirective } from '@app/+shared/directives/clickOutside.directive';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    PaginationComponent,
    TagComponent,
    CommentComponent,
    CommentBoxComponent,
    AlertComponent,
    ErrorComponent,
    NotFoundComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
  ],
  exports: [
    PaginationComponent,
    TagComponent,
    CommentComponent,
    CommentBoxComponent,
    AlertComponent,
    ErrorComponent,
    ClickOutsideDirective
  ],
})
export class SharedModule { }
