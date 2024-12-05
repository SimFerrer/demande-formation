import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  errorInLogIn: boolean = false
  isPopUp: boolean = false;

  /**
   * This login component is used for connecting the user
   * @param authService - Service to manage the state of the user
   * @param formBuilder - Form service used to manage the forms
   * @param router - router to redirect the user
   * @param dialogRef - Optionnal, only used if the component is loaded in a popUp
   */
  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private titleService : Title) { }


  ngOnInit(): void {
    this.titleService.setTitle('Apsiformation - Connexion')
    this.authService.logOut();
    // Initialize form
    this.emailCtrl = this.formBuilder.control('', [Validators.email, Validators.required])
    this.passwordCtrl = this.formBuilder.control('', Validators.required)
    this.loginForm = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl
    })
  }

  ngOnDestroy(): void {
    this.notificationService.clearMessage();
  }

  /**
   * Get the error message associated to a form control
   * @param {AbstractControl} ctrl - The form control to check errors on
   * @returns {string} the error message assiociated to the form control parameter
   */
  getFormControlErrorText(ctrl: AbstractControl): string {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      return 'Veuillez rentrer un e-mail au format jean.michel@apside.com'
    } else {
      return 'Ce champ contient une erreur';
    }
  }

  /**
   * Login using Google
   */
  loginWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then((userCred) => {
        if (userCred.user) {
          this.loginSuccessAction(userCred.user.uid);
        }
      })
      .catch((err) => this.loginErrorAction(err))
  }

  /**
   * Login using email and password
   */
  simpleLogin(): void {
    this.authService.signIn(this.emailCtrl.value, this.passwordCtrl.value)
      .then((userCred) => {
        if (userCred.user) {
          return this.loginSuccessAction(userCred.user.uid)
        }
      })
      .catch((err) => this.loginErrorAction(err))
  }

  /**
   * Raise an alert if login fails
   * @param error - THe login error
   */
  private loginErrorAction(error: Error): void {
    this.errorInLogIn = true;
    alert(`Impossible de se connecter à ce compte.\n${error}`);
  }

  /**
   * Redirect to home page if login succeeds
   */
  private loginSuccessAction(userUid: string): void {
    this.errorInLogIn = false;
    this.router.navigate(['/profile']);
  }

  /**
   * Redirect to account creation page
   */
  goToCreate(): void {
    this.router.navigate(['/createAccount'])
  }

}

