import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from '@app/+user/user-routing.module';
import { SharedModule } from '@app/+shared/shared.module';
import { AngularMaterialModule } from "@app/angular-material.module";

import { UserComponent } from './user.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserFavoritePostsComponent } from './user-favorite-posts/user-favorite-posts.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


@NgModule({
  declarations: [UserComponent, UserPostsComponent, UserFavoritePostsComponent, UserProfileComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
