import { createReducer, on } from '@ngrx/store';
import * as TrainingActions from './training.actions';
import { initialState } from './training.state';

export const trainingReducer = createReducer(
    initialState,

    //loadTrainings
    on(TrainingActions.loadTrainings, state => ({
        ...state,
        loading: true
    })),
    on(TrainingActions.loadTrainingsSuccess, (state, { trainings }) => ({
        ...state,
        trainings,
        loading: false,
        error: null
    })),
    on(TrainingActions.loadTrainingsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    //loadTraining
    on(TrainingActions.loadTraining, state => ({
        ...state,
        loading: true
    })),
    on(TrainingActions.loadTrainingSuccess, (state, { training }) => ({
        ...state,
        training,
        loading: false,
        error: null
    })),
    on(TrainingActions.loadTrainingsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    //addTraining
    on(TrainingActions.addTraining, (state) => ({
        ...state,
        loading: true, 
        error: null,
      })),
      on(TrainingActions.addTrainingSuccess, (state, { training }) => ({
        ...state,
        trainings: [...state.trainings, training], 
        loading: false,
        error: null,
      })),
      on(TrainingActions.addTrainingFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error, 
      })),

      //updateTraining
    on(TrainingActions.updateTraining, (state) => ({
        ...state,
        loading: true, 
        error: null,
      })),
      on(TrainingActions.updateTrainingSuccess, (state, { training }) => ({
        ...state,
        trainings: [...state.trainings, training], 
        loading: false,
        error: null,
      })),
      on(TrainingActions.updateTrainingFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error, 
      }))
)