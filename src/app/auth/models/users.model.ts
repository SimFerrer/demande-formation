import { DocumentReference } from "@angular/fire/compat/firestore";

/**
 * User class to represent an user account in database
 */
export class User {
    email!: string;
    approvedByAdmin: boolean = false
    role: string = "user"
    trainingRef?: DocumentReference[] | null;
}