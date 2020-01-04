import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from '@app/+profile/profile-routing.module';
import { SharedModule } from '@app/+shared/shared.module';
import { AngularMaterialModule } from '@app/angular-material.module';
import { ProfileComponent } from '@app/+profile/profile.component';
import { UserPostsComponent } from '@app/+profile/user-posts/user-posts.component';
import { UserFavoritePostsComponent } from '@app/+profile/user-favorite-posts/user-favorite-posts.component';
import { UserProfileComponent } from '@app/+profile/user-profile/user-profile.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { ProfileNoteComponent } from '@app/+profile/user-notifications/profile-note/profile-note.component';
import { UserPostComponent } from '@app/+profile/user-posts/user-post/user-post.component';


@NgModule({
  declarations: [
    ProfileComponent,
    UserPostsComponent,
    UserFavoritePostsComponent,
    UserProfileComponent,
    UserNotificationsComponent,
    ProfileNoteComponent,
    UserPostComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }

