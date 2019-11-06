import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '@app/+shared/interceptors/auth.interceptor';
import { PaginationComponent } from '@app/+shared/components/pagination/pagination.component';
import { PostInfoComponent } from '@app/+shared/components/post-info/post-info.component';
import { TagComponent } from '@app/+shared/components/tag/tag.component';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatIconModule
} from '@angular/material';
import {AuthService} from "@app/+shared/_services/auth.service";

@NgModule({
  declarations: [PaginationComponent, PostInfoComponent, TagComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  exports: [PaginationComponent, PostInfoComponent, TagComponent],
})
export class SharedModule { }
