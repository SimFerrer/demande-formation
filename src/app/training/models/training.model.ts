import { DocumentReference } from '@angular/fire/compat/firestore';

/**
 * Training class to represent a training in database
 */
export class Training {
    id!: string; 
    userId!: DocumentReference;
    name!: string; 
    module!: string;  //TODO table de réference pour autocompletion
    origin!: OriginStatus; 
    onAssignmentRequest : boolean = false; 
    requestDate!: Date; 
    comment?: string; 
    status!: TrainingStatus; 
    updateDate!: Date; 
}


export enum OriginStatus{
    EA = "ea",
    MISSIONTRACKING = "suivi de mission",
    MISSIONNEEDED = "Besoin de mission",
    CHARTERIC = "charte ic",
    OTHER = "autre"
}
export enum TrainingStatus {
    REQUESTED = "demandée",
    PLANNED = "planifiée",
    INPROGRESS = "en cours",
    COMPLETED = "completée",
    CANCELLED = "annulé",
}