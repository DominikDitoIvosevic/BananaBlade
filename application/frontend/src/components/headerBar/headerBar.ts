import { Component, Input } from 'angular2/core';
import { FORM_DIRECTIVES, COMMON_DIRECTIVES, ControlGroup, Validators, Control } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { AuthService, Form, FormBuilderAdvanced } from '../../services/services';

@Component({
    selector: 'header-bar',
    templateUrl: './dist/components/headerBar/headerBar.html',
    directives: [ FORM_DIRECTIVES, COMMON_DIRECTIVES, RouterLink ]
})
export class HeaderBar {
    loginForm: Form;
    authService: AuthService;

    userName: string;
    userRole: string;

    constructor(fb: FormBuilderAdvanced, authService: AuthService) {
        this.authService = authService;

        this.authService.updateUserData();

        let loginEntities = ['email', 'password'];
        this.loginForm = fb.create(loginEntities, '/user/auth/login');
    }


    onSubmit(value): void {
        this.authService.loginX(value.email, value.password);
    }
}
