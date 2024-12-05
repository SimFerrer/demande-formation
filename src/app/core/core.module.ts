import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FooterComponent } from './components/footer/footer.component';
import { PopupComponent } from './components/popup/popup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrainingModule } from '../training/training.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PopupComponent,
    ProfileComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  imports: [
    CommonModule,
    SharedModule,
    TrainingModule,
    CoreRoutingModule,
  ]
})
export class CoreModule { }
