import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@app/+core/core.module';
import { DashboardModule } from '@app/+dashboard/dashboard.module';
import { ToastrModule } from "ngx-toastr";
import {AuthInterceptor} from "@app/+shared/interceptors/auth.interceptor";
import {AuthService} from "@app/+shared/_services/auth.service";
import {AngularMaterialModule} from "@app/angular-material.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AngularMaterialModule,
    DashboardModule
  ],
  providers: [AuthService , { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
