import { Injectable, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { filter, first, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { User } from '../models/users.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";
import { TrainingService } from '../../training/services/training.service';
@Injectable({
  providedIn: 'root'
})

// Service used to interact with the Firestore users collection
export class UserService implements OnInit {

  private databasePath = '/users';
  userCollection: AngularFirestoreCollection<User>;
  currentUserId!: string;

  constructor(private fireAuthService: AngularFireAuth,
    private database: AngularFirestore,
    private trainingService: TrainingService) {
    this.userCollection = this.database.collection(this.databasePath);
    this.fireAuthService.authState.pipe(
      filter(user => user !== undefined && user !== null),
      tap(user => this.currentUserId = user!.uid)
    ).subscribe();
  }

  ngOnInit(): void {
  }

  /**
   * Get all the users from database
   * @returns {AngularFirestoreCollection<User>} the users collection 
   */
  getAll(): AngularFirestoreCollection<User> {
    return this.userCollection;
  }

  /**
   * Get one user by id
   * @param id - The user id
   * @returns {Observable<User>}
   */
  getUserById(id: string): Observable<User | undefined> {
    return this.userCollection.doc(id).get().pipe(
      map(result => result.data()),
      filter(x => x !== undefined),
      first(),
    );
  }

  /**
   * Get one user by id
   * @param id - The user id
   * @returns {Observable<User>}
   */
  getUserByRef(userRef: DocumentReference): Observable<User> {
    return this.userCollection.doc(userRef.id).get().pipe(
      map(result => result.data()),
      filter(x => x !== undefined),
      first(),
    );
  }

  /**
   * Get one user each time changes are made on it in database
   * @param id - The user id
   * @returns {Observable<User | undefined>} an obervable containing the user if found, undefined otherwise
   */
  getUserChangesById(id: string): Observable<User | undefined> {
    return this.userCollection.doc(id).snapshotChanges().pipe(
      filter((snapshot) => !snapshot.payload.metadata.hasPendingWrites),
      map((snapshot) => snapshot.payload.data() as User)
    );
  }


  /**
   * Create an user in database
   * @param user - The user to create
   * @returns {Promise<DocumentReference<User>>} the promise containing the DocumentReference to the created user
   */
  create(user: User): Promise<DocumentReference<User>> {
    return this.userCollection.add({ ...user });
  }

  /**
   * Create an user in database with a specific id
   * @param user - The user to create 
   * @param id - The user id
   * @returns {Promise<void>} the promise returned by user creation
   */
  createWithId(user: User, id: string): Promise<void> {
    return this.userCollection.doc(id).set({ ...user });
  }

  /**
   * Update an user
   * @param id - The user id
   * @param data - The data to update
   * @returns {Promise<void>} the promise returned by user update
   */
  update(id: string, data: any): Promise<void> {
    return this.userCollection.doc(id).update({ ...data });
  }

  addTrainingById(trainingId: string, user: User): User {
    const docRef: AngularFirestoreDocument<any> = this.database.doc(`/trainings/${trainingId}`);
    const updatedUser: User = {
      ...user,
      trainingRef: [...(user.trainingRef || []), docRef.ref]
    };
    return updatedUser;
  }

  /**
   * Delete an user
   * @param id - The user id
   * @returns {Promise<void>} the promise returned by user delete
   */
  delete(id: string): Promise<void> {
    return this.userCollection.doc(id).delete();
  }

  /**
   * Get the all of the user data and create a .json file to comply to RGPD requirements
   * @param userId the userId
   */
  getUserData(userId: string): void {
    this.getUserById(userId).pipe(
      switchMap((userData) => {
        // Vérifie si l'utilisateur a des formations référencées
        if (userData!.trainingRef && userData!.trainingRef.length > 0) {
          return this.trainingService.getTrainingsByRef(userData!.trainingRef).pipe(
            map((trainings) => {
              // Remplace les références de formations par des données complètes
              const modifiedUserData = { ...userData, trainingRef: trainings };
              return modifiedUserData;
            })
          );
        } else {
          // Si pas de formations, on retourne les données utilisateur sans modification
          return [userData];
        }
      }),
      tap(
        (userData) => {
          // Convertir les données de l'utilisateur en format JSON
          const jsonString = JSON.stringify(userData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);

          // Crée un lien pour télécharger le fichier JSON
          const doc = document.createElement('a');
          doc.href = url;
          doc.download = `${userId}_datas.json`;
          doc.click();
          window.URL.revokeObjectURL(url);  // Nettoyage
        }
      )
    ).subscribe();
  }


}
