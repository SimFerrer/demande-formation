import { Training } from '../models/training.model';

// Définir l'état initial
export interface TrainingState {
  trainings: Training[];
  training: Training | null; 
  loading: boolean;
  error: string | null;
}

export const initialState: TrainingState = {
  trainings: [],
  training: null, 
  loading: false,
  error: null
};