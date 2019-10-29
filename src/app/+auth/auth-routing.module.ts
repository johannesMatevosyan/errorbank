import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthComponent } from '@app/+auth/auth.component';
import { GithubComponent } from "@app/+auth/github/github.component";


const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: 'signin/callback',
      component: GithubComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
