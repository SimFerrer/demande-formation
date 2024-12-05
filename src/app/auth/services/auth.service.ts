import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";
import { filter, firstValueFrom, map, Observable } from "rxjs";
import { UserService } from "./user.service";
import { User } from "../models/users.model";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

// Service used to manage user authentication
export class AuthService{
    user$: Observable<firebase.User | null> = this.fireAuthService.authState;

    private readonly errorApprovedByAdmin: Error = new Error("Votre compte n'a pas été approuvé. Veuillez contacter un Admin");
    private readonly errorCantFindId: Error = new Error("Impossible de retrouver l'id utilisateur");

    constructor(private fireAuthService: AngularFireAuth,
                private userService: UserService,
                private router: Router){}

    /**
     * Create a user in database
     * @param email - The user email
     * @param credentials  - The user credentials
     * @returns {Promise<void>} the promise of user creation 
     */
    createUserInDatabase(email: string, credentials: firebase.auth.UserCredential){

        let user : User = {
            email: email,
            approvedByAdmin: false,
            role: "user"
        }
        credentials.additionalUserInfo?.isNewUser

        if(credentials.user){
            return this.userService.createWithId(user,credentials.user.uid);
        } else {
            throw this.errorCantFindId;
        }
    }

    /**
     * Sign up an user
     * @param email - The user email
     * @param password - The user password
     * @returns {Promise<void>} the promise of user creation
     */
    signUp(email: string, password: string): Promise<void>{
        return this.fireAuthService.createUserWithEmailAndPassword(email, password)
        .then( (cred) => this.createUserInDatabase(email, cred))
        .catch((error) => {throw error;})
    }

    /**
     * Check if an user is authorized in database
     * @param uid - The user indentifier
     * @returns {Observable<string>} an observable containing the user uid
     */
    isUserAuthorizedInDatabase$(userId: string): Observable<string>{
        return this.userService.getUserById(userId).pipe(
            filter(x => x !== undefined),
            map( (databaseUser : User) => {
                if(databaseUser && !databaseUser.approvedByAdmin){
                    throw this.errorApprovedByAdmin;
                }
                return userId;
            })
        )
    }

    /**
     * Sign in an user
     * @param email - The user email
     * @param password - THe user password
     * @returns {Promise<Observable<string>>} the promise of the observable containing the user uid
     */
    async signIn(email: string, password: string): Promise<firebase.auth.UserCredential>{
        let credId : firebase.auth.UserCredential = await this.fireAuthService.signInWithEmailAndPassword(email, password);
        return credId;
    }

    /**
     * Sign in an user using GOogle
     * @returns {Promise<Observable<boolean>>} the promise of the observable containing the user uid
     */
    async signInWithGoogle(): Promise<firebase.auth.UserCredential>{
        let credId : firebase.auth.UserCredential = await this.fireAuthService.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        if(credId.user){
            if(credId.user.email && credId.additionalUserInfo && credId.additionalUserInfo.isNewUser){
                this.createUserInDatabase(credId.user.email, credId);
            }
        }
        return credId;
    }

    /**
     * Log out the current user
     * @returns {Promise<void>} the promise returned by user sign out
     */
    logOut(){
        this.router.navigateByUrl("");
        return this.fireAuthService.signOut();
    }

    /**
     * Delete all of the datas linked to the user currently connected
     */
    deleteAllDatas(): Promise<void>{
        return firstValueFrom(this.user$)
        .then(
            (user) => {
            if(user){
                return this.userService.delete(user.uid).then(
                    () => user.delete()
                );
            }
            throw new Error("Un problème est survenu ! Veuillez vous reconnecter")
            }
        )
        .catch((error) => {
            switch(error.code){
                case 'auth/requires-recent-login': 
                    alert("Cela fait trop longtemps que vous êtes connectés."+
                          "Vos données de jeux ont bien été supprimé, mais pour finaliser la suppression veuillez vous reconnectez et refaire cette opération.")
                    break;
                default: 
                    alert(error)
                    break
            }
  
        })
        .finally(() => this.logOut())
    }
    
}