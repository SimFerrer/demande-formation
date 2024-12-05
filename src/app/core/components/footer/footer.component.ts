import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from "firebase/compat/app";
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent {

  user$: Observable<firebase.User | null> = this.authService.user$;

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Redirect to rules page
   */
  goToRules() {
    /**
   * TODO explain fonctionnality
   */
    
  }

}
