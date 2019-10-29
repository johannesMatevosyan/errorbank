import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from '@app/+auth/auth-routing.module';
import { GithubComponent } from './github/github.component';
import { AuthComponent } from './auth.component';



@NgModule({
  declarations: [GithubComponent, AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
