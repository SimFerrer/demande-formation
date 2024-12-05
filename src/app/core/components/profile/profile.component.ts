import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import { Router } from '@angular/router';
import { PopupService } from '../../services/popup.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user$: Observable<firebase.User | null>= this.authService.user$;

  constructor(private router: Router, 
              private popUpService: PopupService,
              private authService: AuthService,
              private titleService : Title){
  }
  
  ngOnInit(): void {
    this.titleService.setTitle('Apsiformation - Profil')
  }

  /**
   * Open the popUp to delete the account
   */
  onDeleteAccount(){
    this.popUpService.openConfirmDeletionPopup();
  }

  /**
   * Redirect the user to the training list
   */
  onTraining(){
    this.router.navigateByUrl("/training");
  }



}
