import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '@app/+shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: 'users', loadChildren: '@app/+users/users.module#UsersModule' },
  { path: 'info', loadChildren: '@app/+info-pages/info-pages.module#InfoPagesModule' },
  { path: 'user', loadChildren: '@app/+profile/profile.module#ProfileModule' },
  { path: 'auth', loadChildren: '@app/+auth/auth.module#AuthModule' },
  { path: '', loadChildren: '@app/+dashboard/dashboard.module#DashboardModule' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
