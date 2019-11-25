import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA} from '@angular/material';
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
  MatMenuModule, MatDialogRef
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
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ]
})
export class AngularMaterialModule { }
