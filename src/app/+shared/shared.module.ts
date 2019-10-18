import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { PostInfoComponent } from './post-info/post-info.component';
import { TagComponent } from './tag/tag.component';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  declarations: [PaginationComponent, PostInfoComponent, TagComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule
  ],
  exports: [PaginationComponent, PostInfoComponent, TagComponent],
})
export class SharedModule { }
