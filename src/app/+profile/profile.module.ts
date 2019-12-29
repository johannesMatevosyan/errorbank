import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from '@app/+profile/profile-routing.module';
import { SharedModule } from '@app/+shared/shared.module';
import { AngularMaterialModule } from '@app/angular-material.module';
import { ProfileComponent } from '@app/+profile/profile.component';
import { UserPostsComponent } from '@app/+profile/user-posts/user-posts.component';
import { UserFavoritePostsComponent } from '@app/+profile/user-favorite-posts/user-favorite-posts.component';
import { UserProfileComponent } from '@app/+profile/user-profile/user-profile.component';


@NgModule({
  declarations: [ProfileComponent, UserPostsComponent, UserFavoritePostsComponent, UserProfileComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }

