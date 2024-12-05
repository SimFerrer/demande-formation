import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from "firebase/compat/app";
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user$: Observable<firebase.User | null> = this.authService.user$;

  constructor(private authService: AuthService,
    private router: Router,
    private popUpService: PopupService) { }


  ngOnInit(): void {
  }

  /*TODO never use*/
  onProfileAction() {
    this.router.navigateByUrl("/profile");
  }

  /**
   * Log out user and redirect to login page
   */
  logOut() {
    this.authService.logOut()
      .then(() => this.router.navigateByUrl('/'))
      .catch(() => {
        window.alert("Impossible de se déconnecter")
      });
  }


  /**
 * 
 * @param user 
 */
  onExportData(user: firebase.User) {
    this.popUpService.openConfirmExportPopup(user.uid);
  }

}
