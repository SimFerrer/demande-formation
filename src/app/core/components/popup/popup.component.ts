import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPopUpData, PopUpData } from './models/pop-up-data.interface';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {

  data: IPopUpData;

  constructor(private dialogRef: MatDialogRef<PopupComponent>,
              @Inject(MAT_DIALOG_DATA) data?: IPopUpData){
        this.data = data || new PopUpData();
  }

  closeDialog(){
    this.dialogRef.close();
  }

  applyButtonAction(buttonAction: VoidFunction) {
    buttonAction.call(this);
    this.closeDialog();
  }


}
