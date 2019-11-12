import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/+shared/shared.module';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatMenuModule,
  MatIconModule
} from '@angular/material';
import { HeaderComponent } from '@app/+core/header/header.component';
import { FooterComponent } from '@app/+core/footer/footer.component';
import { SidebarComponent } from '@app/+core/sidebar/sidebar.component';
import { MainFilterComponent } from '@app/+core/main-filter/main-filter.component';
import { ProfileDropdownComponent } from '@app/+core/profile-dropdown/profile-dropdown.component';
import { RelatedPostsComponent } from './sidebar/related-posts/related-posts.component';
import { LatestPostsComponent } from './sidebar/latest-posts/latest-posts.component';
import { CoreRoutingModule } from "@app/+core/core-routing.module";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MainFilterComponent,
    ProfileDropdownComponent,
    RelatedPostsComponent,
    LatestPostsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [HeaderComponent, FooterComponent, SidebarComponent, MainFilterComponent, ProfileDropdownComponent],
})
export class CoreModule { }
