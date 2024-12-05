import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../components/popup/popup.component';
import { AuthService } from '../../auth/services/auth.service';
import { ConfirmMatDialogConfig, ConfirmPopUpData } from '../components/popup/models/confirm-pop-up-data.impl';
import { InfoMatDialogConfig, InfoPopUpData } from '../components/popup/models/info-pop-up-data.impl';
import { UserService } from '../../auth/services/user.service';

@Injectable({
  providedIn: 'root'
})

// Service used to display customized pop-up
export class PopupService {

  constructor(private dialog: MatDialog, private authService: AuthService, private userService: UserService) { }

  /**
   * Open a popup with the given configuration
   * @param dialogConfig - The popup configuration
   * @returns - the ref of the popup
   */
  openPopup(dialogConfig?: MatDialogConfig): MatDialogRef<PopupComponent, any> {
    if (!dialogConfig) {
      return this.dialog.open(PopupComponent)
    } else {
      return this.dialog.open(PopupComponent, dialogConfig)
    }
  }

  /**
   * Open a popup to confirm the deletion of the user datas
   */
  openConfirmDeletionPopup() {
    const confirmAction = () => {
      //Delete the datas
      this.authService.deleteAllDatas();
      //Display a pop-up to notify the user
      const infoPopUpData: InfoPopUpData = new InfoPopUpData("Votre compte a bien été supprimé", "", () => { });
      this.dialog.open(PopupComponent, new InfoMatDialogConfig(infoPopUpData));
    }

    const confirmData: ConfirmPopUpData = new ConfirmPopUpData("Êtes-vous sur ?", "", confirmAction)
    this.dialog.open(PopupComponent, new ConfirmMatDialogConfig(confirmData));
  }

  openConfirmExportPopup(userId: string) {
    const confirmAction = () => {
      //Display a pop-up to notify the user
      /*TODO be careful to take all the data*/
      this.userService.getUserData(userId);
    }

    const confirmData: ConfirmPopUpData = new ConfirmPopUpData("Voulez-vous téléchargez vos données ?", "", confirmAction)
    this.dialog.open(PopupComponent, new ConfirmMatDialogConfig(confirmData));
  }
}
