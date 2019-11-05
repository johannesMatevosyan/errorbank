import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { UserFavoritePostsComponent } from './user-favorite-posts/user-favorite-posts.component';



@NgModule({
  declarations: [UserComponent, UserPostsComponent, UserFavoritePostsComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
