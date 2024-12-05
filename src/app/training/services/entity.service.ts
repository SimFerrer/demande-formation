import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EntityService {



    constructor(private afs: AngularFirestore) { }

    /**
    * Generic method to fetch all documents from a collection
    * @param collectionName Name of the Firestore collection
    * @returns Observable of an array of document names
    */
    getEntities(collectionName: string): Observable<string[]> {
        return this.afs.collection(collectionName).valueChanges().pipe(
            map((entities: any[]) => entities.map(e => e.name))
        );
    }

    /**
     * Generic method to add a document to a collection
     * @param collectionName Name of the Firestore collection
     * @param entityName Name of the entity to add
     * @returns Observable<void> (completes if the document was added or already exists)
     */
    addEntity(collectionName: string, entityName: string): Observable<void> {
        const docRef = this.afs.collection(collectionName).doc(entityName);
        return docRef.get().pipe(
            switchMap((docSnapshot) => {
                if (!docSnapshot.exists) {
                    return from(docRef.set({ name: entityName }));
                } else {
                    return of(void 0); // Émet une valeur vide si le document existe déjà
                }
            })
        );
    }

    // Convenience methods for Modules
    getModules(): Observable<string[]> {
        return this.getEntities('modules');
    }

    addModule(moduleName: string): Observable<void> {
        return this.addEntity('modules', moduleName);
    }

    // Convenience methods for Organisms
    getOrganisms(): Observable<string[]> {
        return this.getEntities('organisms');
    }

    addOrganism(organismName: string): Observable<void> {
        return this.addEntity('organisms', organismName);
    }
}
