import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, UntypedFormControl } from '@angular/forms';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  debouncer: any;

  constructor(private userService: UserService) { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { passwordValidation: true };
    };
  }

  confirmPasswordValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ passwordMismatch: true });
    }
  }

  userNameValidator(userControl: UntypedFormControl) {
    clearTimeout(this.debouncer);
    return new Promise(resolve => {
      this.debouncer = setTimeout(() => {
        this.userService.validateUserName(userControl.value).subscribe(result => {
          if (result) {
            resolve({ userNameNotAvailable: true });
          } else {
            resolve(null);
          }
        });
      }, 1000);
    });
  }
}
