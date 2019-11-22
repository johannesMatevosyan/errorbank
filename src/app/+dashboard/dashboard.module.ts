import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/+shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from '@app/+dashboard/dashboard-routing.module';
import { CoreModule } from '@app/+core/core.module';
import { DashboardComponent } from '@app/+dashboard/dashboard.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ListPostsComponent } from './list-errors/list-posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { AngularMaterialModule } from "@app/angular-material.module";
import { PostInfoComponent } from "@app/+dashboard/list-errors/post-info/post-info.component";
import { PostComponent } from './list-errors/post/post.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CreatePostComponent,
    ListPostsComponent,
    EditPostComponent,
    ViewPostComponent,
    PostInfoComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    CoreModule,
    AngularMaterialModule,
  ],
  exports: [DashboardComponent, CreatePostComponent, ListPostsComponent]
})
export class DashboardModule { }
