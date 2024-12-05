import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private collectionName = 'modules';



    constructor(private afs: AngularFirestore) { }

    getModules(): Observable<string[]> {
        return this.afs.collection(this.collectionName).valueChanges().pipe(
            map((modules: any[]) => modules.map(m => m.name))
        );
    }

    addModule(moduleName: string): Observable<void> {
        const docRef = this.afs.collection(this.collectionName).doc(moduleName);
        return docRef.get().pipe(
            switchMap((docSnapshot) => {
                if (!docSnapshot.exists) {
                    return from(docRef.set({ name: moduleName }));
                } else {
                    return of(void 0); // Émet une valeur vide si le document existe déjà
                }
            })
        );
    }


}
