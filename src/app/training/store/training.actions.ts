import { createAction, props } from '@ngrx/store';
import { Training } from '../models/training.model';

// Définir les actions pour charger les formations
export const loadTrainings = createAction('[Training List] Load Trainings');
export const loadTrainingsSuccess = createAction(
    '[Training List] Load Trainings Success',
    props<{ trainings: Training[] }>()
);
export const loadTrainingsFailure = createAction(
    '[Training List] Load Trainings Failure',
    props<{ error: any }>()
);

export const loadTraining = createAction(
    '[Training] Load Training',
    props<{ trainingId: string }>()
);
export const loadTrainingSuccess = createAction(
    '[Training] Load Training Success',
    props<{ training: Training }>()
);
export const loadTrainingFailure = createAction(
    '[Training] Load Training Failure',
    props<{ error: any }>()
);


export const addTraining = createAction(
    '[Training] Add Training',
    props<{ training: Training, userID:string }>()
);
export const addTrainingSuccess = createAction(
    '[Training] Add Training Success',
    props<{ training: Training }>()
);
export const addTrainingFailure = createAction(
    '[Training] Add Training Failure',
    props<{ error: any }>()
);

export const updateTraining = createAction(
    '[Training] Update Training',
    props<{ training: Training }>() // On passe l'objet Training à mettre à jour
);

// Action pour indiquer le succès de la mise à jour
export const updateTrainingSuccess = createAction(
    '[Training] Update Training Success',
    props<{ training: Training }>() // On peut renvoyer le Training mis à jour en réponse
);

// Action pour indiquer une erreur lors de la mise à jour
export const updateTrainingFailure = createAction(
    '[Training] Update Training Failure',
    props<{ error: any }>() // Gestion des erreurs si la mise à jour échoue
);


