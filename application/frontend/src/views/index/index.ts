import { Component } from 'angular2/core';
import { Location, RouteConfig, RouterLink, Router, CanActivate } from 'angular2/router';
import { COMMON_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators, Control } from 'angular2/common';

import { HttpAdvanced, AuthService } from '../../services/services';

import { Player } from '../../components/player/player';
import { Popular } from '../../components/popular/popular';
import { RadioDescr } from '../../components/radioDescr/radioDescr';
import { Schedule } from '../../components/schedule/schedule';
import { Station } from '../../components/station/station';

@Component({
    selector: 'Index',
    directives: [ Player, Popular, RadioDescr, Schedule, Station ],
    templateUrl: './dist/views/index/index.html'
})
export class Index {
    http: HttpAdvanced;
    registerForm: ControlGroup;
    authService: AuthService;

    onSubmitRegistration(values: String): void {
        this.http.post('/user/auth/register', values);
    }

    constructor(fb: FormBuilder, http: HttpAdvanced, authService: AuthService) {
        this.http = http;
        this.authService = authService;

        this.registerForm = fb.group({
            'first_name': new Control('', Validators.required),
            'last_name': new Control('', Validators.required),
            'email': new Control('', Validators.required),
            'password': new Control('', Validators.required),
            'password2': new Control('', Validators.required),
            'year_of_birth': new Control('', Validators.required),
            'occupation': new Control('', Validators.required)
        });
    }

    resetControls(){
        for (let i in this.registerForm.controls) {
            this.registerForm.controls[i].value = '';
            this.registerForm.controls[i].updateValueAndValidity();
            this.registerForm.updateValueAndValidity();
        }
    }
}
