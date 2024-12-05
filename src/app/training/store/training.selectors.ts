import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrainingState } from './training.state';

// Sélecteur de feature : permet d'accéder à l'état des formations
const getTrainingState = createFeatureSelector<TrainingState>('trainingState');

// Sélecteur pour récupérer les formations
export const getTrainings = createSelector(
  getTrainingState,
  (state: TrainingState) => state.trainings
);

// Sélecteur pour récupérer une formation spécifique
export const getTraining = createSelector(
    getTrainingState,
    (state: TrainingState) => state.training  // Retourne la formation spécifique
  );

// Sélecteur pour vérifier si les données sont en cours de chargement
export const getLoading = createSelector(
  getTrainingState,
  (state: TrainingState) => state.loading
);

// Sélecteur pour récupérer les erreurs éventuelles
export const getError = createSelector(
  getTrainingState,
  (state: TrainingState) => state.error
);
