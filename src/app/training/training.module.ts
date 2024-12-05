import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingFormComponent } from './training-form/training-form.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './store/training.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TrainingEffects } from './store/training.effects';


@NgModule({
  declarations: [
    TrainingFormComponent,
    TrainingListComponent
  ],
  exports: [
    TrainingFormComponent,
    TrainingListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TrainingRoutingModule,
    StoreModule.forFeature("trainingState", trainingReducer),
    EffectsModule.forFeature([TrainingEffects])
  ]
})
export class TrainingModule { }
