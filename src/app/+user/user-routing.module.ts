import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserPostsComponent } from '@app/+user/user-posts/user-posts.component';
import { UserComponent } from '@app/+user/user.component';
import { UserFavoritePostsComponent } from '@app/+user/user-favorite-posts/user-favorite-posts.component';
import { UserProfileComponent } from '@app/+user/user-profile/user-profile.component';

const routes: Routes = [{
    path: '',
    component: UserComponent,
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
        path: 'favorite-posts',
        component: UserFavoritePostsComponent
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
