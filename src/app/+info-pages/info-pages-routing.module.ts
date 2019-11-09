import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {AboutComponent} from "@app/+info-pages/about/about.component";
import {TermsComponent} from "@app/+info-pages/terms/terms.component";
import {InfoPagesComponent} from "@app/+info-pages/info-pages.component";


const routes: Routes = [{
  path: '',
  component: InfoPagesComponent,
  children: [
    {
      path: 'about',
      component: AboutComponent
    },
    {
      path: 'terms',
      component: TermsComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoPagesRoutingModule {
}
