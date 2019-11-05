import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from '@app/+auth/auth.component';
import { GithubComponent } from "@app/+auth/github/github.component";


const routes: Routes = [
  {
    path: 'user-profile',
    component: AuthComponent,
  },
  {
    path: 'user-posts',
    component: AuthComponent,
  },
  {
    path: 'user-favorite-posts',
    component: AuthComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
