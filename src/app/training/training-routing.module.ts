import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingListComponent } from './training-list/training-list.component';
import { TrainingFormComponent } from './training-form/training-form.component';
import { HomeComponent } from '../core/components/home/home.component';


const routes: Routes = [
  { path: 'list', component: TrainingListComponent },
  { path: 'create', component: TrainingFormComponent },
  { path: 'edit/:idTraining', component: TrainingFormComponent },
  { path: '', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
