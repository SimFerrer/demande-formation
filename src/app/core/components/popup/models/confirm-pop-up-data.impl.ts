import { MatDialogConfig } from "@angular/material/dialog";
import { IPopUpData, PopUpButtonsBehaviour } from "./pop-up-data.interface";

// Class used to store all the pop-up data for a confirmation pop-up
export class ConfirmPopUpData implements IPopUpData{
    title: string;
    description: string;
    buttonsBehaviour: PopUpButtonsBehaviour[];
    
    constructor(title: string = "Êtes-vous sur ?", description: string = "",
         confirmAction: VoidFunction = () => {}, cancelAction: VoidFunction = () => {} ){
        this.title = title;
        this.description = description;
        const cancelButton: PopUpButtonsBehaviour = {
            buttonName: "Annuler",
            buttonAction: cancelAction
        };
        const confirmButton: PopUpButtonsBehaviour = {
            buttonName: "Confirmer",
            buttonAction: confirmAction
        }
        this.buttonsBehaviour = [confirmButton, cancelButton];
    }
}

// Class used to configure pop-up behavior for a confirmation pop-up
export class ConfirmMatDialogConfig extends MatDialogConfig{
    override autoFocus = true;
    override data?: ConfirmPopUpData;

    constructor(data?: ConfirmPopUpData){
        super();
        this.data = data || new ConfirmPopUpData();
    }
}
