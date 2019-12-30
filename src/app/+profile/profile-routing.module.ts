import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPostsComponent } from '@app/+profile/user-posts/user-posts.component';
import { ProfileComponent } from '@app/+profile/profile.component';
import { UserFavoritePostsComponent } from '@app/+profile/user-favorite-posts/user-favorite-posts.component';
import { UserProfileComponent } from '@app/+profile/user-profile/user-profile.component';
import { UserNotificationsComponent } from '@app/+profile/user-notifications/user-notifications.component';

const routes: Routes = [{
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'profile/:id',
        component: UserProfileComponent
      },
      {
        path: 'posts/:id',
        component: UserPostsComponent
      },
      {
        path: 'favourites/:id',
        component: UserFavoritePostsComponent
      },
      {
        path: 'notifications/:id',
        component: UserNotificationsComponent
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {
}
