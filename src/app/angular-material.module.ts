import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatIconModule,
  MatDialogModule,
  MatListModule,
  MatDividerModule,
  MatMenuModule
} from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
  ]
})
export class AngularMaterialModule { }
