import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'users', loadChildren: '@app/+users/users.module#UsersModule' },
  { path: 'info', loadChildren: '@app/+info-pages/info-pages.module#InfoPagesModule' },
  { path: 'user', loadChildren: '@app/+user/user.module#UserModule' },
  { path: 'auth', loadChildren: '@app/+auth/auth.module#AuthModule' },
  { path: '', loadChildren: '@app/+dashboard/dashboard.module#DashboardModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
