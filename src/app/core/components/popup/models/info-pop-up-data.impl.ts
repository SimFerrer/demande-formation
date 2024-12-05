import { MatDialogConfig } from "@angular/material/dialog";
import { IPopUpData, PopUpButtonsBehaviour } from "./pop-up-data.interface";

// Class used to store all the pop-up data for an info pop-up
export class InfoPopUpData implements IPopUpData{
    title: string;
    description: string;
    buttonsBehaviour: PopUpButtonsBehaviour[];
    
    constructor(title: string = "Êtes-vous sur ?", description: string = "",
         closeAction: VoidFunction = () => {}){
        this.title = title;
        this.description = description;
        const closeButton: PopUpButtonsBehaviour = {
            buttonName: "Fermer",
            buttonAction: closeAction
        }
        this.buttonsBehaviour = [closeButton];
    }
}

// Class used to store all the pop-up data for an info pop-up
export class InfoMatDialogConfig extends MatDialogConfig{
    override autoFocus = true;
    override data?: InfoPopUpData;

    constructor(data?: InfoPopUpData){
        super();
        this.data = data || new InfoPopUpData();
    }
}
