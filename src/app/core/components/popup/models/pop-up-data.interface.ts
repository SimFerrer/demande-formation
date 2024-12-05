
/**
 * Data interface to represent the data's sent to a popup
 */
export interface IPopUpData {
    title: string;
    description: string;
    buttonsBehaviour: PopUpButtonsBehaviour[]
}

export class PopUpButtonsBehaviour{
    buttonName: string = "Fermer cette fenêtre";
    buttonAction: VoidFunction = () => {};

    constructor(buttonName: string, buttonAction: VoidFunction){
        this.buttonName = buttonName;
        this.buttonAction = buttonAction;
    }
}

export class PopUpData {
    title: string = "";
    description: string = "";
    buttonsBehaviour: PopUpButtonsBehaviour[] = [];
    
    constructor(title?: string, description?: string, buttonsBehaviour?: PopUpButtonsBehaviour[]){
        this.title = title || "";
        this.description = description || "";
        this.buttonsBehaviour = buttonsBehaviour || [];
    }
}
