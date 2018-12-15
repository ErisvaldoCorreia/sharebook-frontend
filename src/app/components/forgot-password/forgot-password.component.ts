import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../core/services/user/user.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { PasswordValidation } from '../../core/utils/passwordValidation';
import * as AppConst from '../../core/utils/app.const';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _scUser: UserService,
    private _scAlert: AlertService
  ) {
    this.formGroup = _formBuilder.group({
      hashCodePassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(AppConst.passwordPattern)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnInit() {
    let hashCodePassword = '';
    this._activatedRoute.params.subscribe((param) => hashCodePassword = param.hashCodePassword);

    const changeUserPasswordByHashCodeVM = {
      hashCodePassword: hashCodePassword,
      newPassword: '',
      confirmPassword: ''
    };

    this.formGroup.setValue(changeUserPasswordByHashCodeVM);
  }

  changePassword() {
    if (this.formGroup.valid) {
      this._scUser.changeUserPasswordByHashCode(this.formGroup.value).subscribe(
        data => {
          if (data.success || data.authenticated) {
            this._scAlert.success('Senha atualizada com sucesso', true);
            this._router.navigate(['/login']);
          } else {
            this._scAlert.error(data.messages[0]);
          }
        },
        error => {
          this._scAlert.error(error);
        }
      );
    }
  }

}
