import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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



@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent, MainFilterComponent, ProfileDropdownComponent, RelatedPostsComponent],
  imports: [
    CommonModule,
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
