import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from '@app/+users/users-routing.module';
import { UsersComponent } from '@app/+users/users.component';
import { ListUsersComponent } from '@app/+users/list-users/list-users.component';

@NgModule({
  declarations: [UsersComponent, ListUsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
