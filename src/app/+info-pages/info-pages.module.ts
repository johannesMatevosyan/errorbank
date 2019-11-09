import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoPagesRoutingModule } from '@app/+info-pages/info-pages-routing.module';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { InfoPagesComponent } from './info-pages.component';



@NgModule({
  declarations: [AboutComponent, TermsComponent, InfoPagesComponent],
  imports: [
    CommonModule,
    InfoPagesRoutingModule
  ]
})
export class InfoPagesModule { }
