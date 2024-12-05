import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { NotificationComponent } from './components/notification/notification.component';


@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NotificationComponent
  ],
  providers:[
    provideHttpClient()
  ]
})

export class SharedModule { }
