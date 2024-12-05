import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { confirmPasswordField, confirmPasswordValidator } from '../../../shared/Validators/confirmPassword.validator';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {

  @ViewChild('emailInput') emailInputRef!: ElementRef;

  createForm!: FormGroup;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  passwordConfirmCtrl!: FormControl;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationService : NotificationService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Apsiformation - Inscription')

    // Initialize form
    this.emailCtrl = this.formBuilder.control('', [Validators.email, Validators.required]);
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.passwordConfirmCtrl = this.formBuilder.control('', Validators.required);
    this.createForm = this.formBuilder.group({
      email: this.emailCtrl,
      password: this.passwordCtrl,
      passwordConfirm: this.passwordConfirmCtrl,
    },
      { validators: confirmPasswordValidator }
    );
  }

  /**
   * Check password consistency in form
   * @returns {boolean} true if the password is filled and  identical in both form fields, false otherwise
   */
    isPasswordIdentical(): boolean {
    return !this.passwordCtrl.hasError("required") && !this.passwordConfirmCtrl.hasError("required") && this.createForm.hasError(confirmPasswordField)
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
    } else if (ctrl.hasError(confirmPasswordField)) {
      return "Les mots de passes sont différents"
    } else {
      return 'Ce champ contient une erreur';
    }
  }

  /**
   * Create an account using email and password
   */
  createAccount(): void {
    if (this.createForm.valid) {
      this.authService.signUp(this.emailCtrl.value, this.passwordCtrl.value)
        .then(() => {
          this.notificationService.setMessage('Compte créé avec succès ! Veuillez vous connecter.');
          this.goToLogin()
        })
    }
    else {
      this.createForm.markAllAsTouched();
      this.emailInputRef.nativeElement.focus();
    }

  }

  /**
   * Redirect to login page
   */
  goToLogin(): void {
    this.router.navigateByUrl('');
  }

}
