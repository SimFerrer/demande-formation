import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { filter, forkJoin, map, Observable, tap } from "rxjs";
import firebase from 'firebase/compat/app';
import { Training } from "../models/training.model";

@Injectable({
    providedIn: "root"
})

// Service used to interact with the Firestore trainings collection
export class TrainingService {
    private databasePath = 'trainings';
    trainingsCollection: AngularFirestoreCollection<Training>;

    constructor(private database: AngularFirestore) {
        this.trainingsCollection = database.collection(this.databasePath);
    }


    addTraining(training: Training, id: string): Promise<void> {
        return this.trainingsCollection.doc(id).set({ ...training });
    }

    getTrainings(): Observable<Training[]> {
        return this.trainingsCollection.valueChanges({ idField: 'id' });
    }

    getTrainingsByRef(trainingRefs: DocumentReference[]): Observable<any[]> {
        // On crée un tableau d'observables pour chaque formation
        const trainingObservables = trainingRefs.map(ref => this.trainingsCollection.doc(ref.id).get().pipe(
            map(doc => {
                const trainingData = doc.data();
                if (trainingData) {
                    const { userId, ...cleanedData } = trainingData;
                    return cleanedData; 
                }
                return null;
            })
        ));

        // On attend que toutes les formations soient récupérées en parallèle
        return forkJoin(trainingObservables);
    }

    getTrainingById(id: string): Observable<Training> {
        return this.trainingsCollection.doc(id).get().pipe(
            map(result => result.data() as Training)
        );
    }


    /**
     * Update a game
     * @param id - The training id
     * @param data - The training to update
     * @returns {Promise<void>} the promise returned by training update
     */
    updateTraining(training: Training, id: string): Promise<void> {
        return this.trainingsCollection.doc(id).update({ ...training });
    }

    convertTimeStampToDate(trainings: Training[]): Training[] {

        return trainings.map(training => ({
            ...training,
            updateDate: training.updateDate instanceof firebase.firestore.Timestamp
                ? new Date(training.updateDate.seconds * 1000) // Convertir le Timestamp en Date
                : training.updateDate,  // Si ce n'est pas un Timestamp, laissez tel quel
            requestDate: training.requestDate instanceof firebase.firestore.Timestamp
                ? new Date(training.requestDate.seconds * 1000) // Convertir le Timestamp en Date
                : training.requestDate
        }))

    }



}