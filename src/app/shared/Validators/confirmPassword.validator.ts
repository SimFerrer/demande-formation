import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPasswordField : string = "PasswordNoMatch"

export const confirmPasswordValidator: ValidatorFn = 
(control: AbstractControl): ValidationErrors | null =>
    {
        return control.value.password === control.value.passwordConfirm? null : {PasswordNoMatch: true};
    }