import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListUsersComponent } from '@app/+users/list-users/list-users.component';
import { UsersComponent } from '@app/+users/users.component';


const routes: Routes = [{
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'list',
        component: ListUsersComponent
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
