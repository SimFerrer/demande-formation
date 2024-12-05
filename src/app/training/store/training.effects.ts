import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap, tap, take } from 'rxjs/operators';
import { TrainingService } from '../services/training.service';
import * as TrainingActions from './training.actions';
import { UserService } from '../../auth/services/user.service';
import { EntityService } from '../services/entity.service';

@Injectable()
export class TrainingEffects {

    constructor(
        private actions$: Actions,
        private trainingService: TrainingService,
        private userService: UserService,
        private entityService: EntityService
    ) { }

    loadTrainings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrainingActions.loadTrainings),
            switchMap(() =>
                this.trainingService.getTrainings().pipe(
                    map((training) => this.trainingService.convertTimeStampToDate(training)),
                    map((trainings) => {
                        return trainings.sort((a, b) => {
                            const dateA = new Date(a.updateDate);
                            const dateB = new Date(b.updateDate);
                            return dateB.getTime() - dateA.getTime();  // 'desc' order
                        });
                    }),
                    map(trainings => TrainingActions.loadTrainingsSuccess({ trainings })),
                    catchError(error => of(TrainingActions.loadTrainingsFailure({ error })))
                )
            )
        )
    );

    loadTrainings = createEffect(() =>
        this.actions$.pipe(
            ofType(TrainingActions.loadTraining),
            switchMap(({ trainingId }) =>
                this.trainingService.getTrainingById(trainingId).pipe(
                    map(training => TrainingActions.loadTrainingSuccess({ training })),
                    catchError(error => of(TrainingActions.loadTrainingFailure({ error })))
                )
            )
        )
    );

    addTraining$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrainingActions.addTraining),
            switchMap(({ training, userID }) =>
                from(this.trainingService.addTraining(training, training.id)).pipe(
                    switchMap(() =>
                        this.userService.getUserById(userID).pipe(
                            map(user => this.userService.addTrainingById(training.id, user!)),
                            switchMap(updatedUser =>
                                from(this.userService.update(userID, updatedUser)).pipe(
                                    tap(() => {
                                        this.entityService.addModule(training.module).pipe(take(1)).subscribe()
                                        this.entityService.addOrganism(training.organism).pipe(take(1)).subscribe()
                                    }),
                                    map(() => TrainingActions.addTrainingSuccess({ training })),
                                    catchError(error => of(TrainingActions.addTrainingFailure({ error })))
                                )
                            )
                        )
                    ),
                    catchError(error => of(TrainingActions.addTrainingFailure({ error })))
                )
            )
        )
    );



    updateTrainings = createEffect(() =>
        this.actions$.pipe(
            ofType(TrainingActions.updateTraining),
            switchMap(({ training }) =>
                this.trainingService.updateTraining(training, training.id).then(() => training).then(
                    (updateTraining) => {
                        return TrainingActions.updateTrainingSuccess({ training: updateTraining });
                    },
                    (error) => TrainingActions.updateTrainingFailure({ error })
                )
            )
        )
    )
}
