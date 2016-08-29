import { Injectable, Injector, Inject, provide } from 'angular2/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { HttpWithNotif } from './../services/services';

let ACCOUNT_TYPE: string = "accountType";

let UNLOGGED = '-1';
let USER = '1';
let EDITOR = '2';
let ADMIN = '3';
let OWNER = '4';

@Injectable()
export class AuthService {
  private http: HttpWithNotif;
  public isLoggedIn: boolean = false;
  public userRole: string = "";
  public userName: string = "";
  public authLevel: string = UNLOGGED;

  public accountType: number = 0;

  constructor(httpWithNotif: HttpWithNotif) {
    this.http = httpWithNotif;
    this.updateUserData();
  }

  updateUserAuth(): Observable<any> {
    let getType = this.http.get<any>('/user/account/type');

    return getType.map((res) => {
      if (res.account_type && res.account_type > 0) {
        this.authLevel = res.account_type;
        this.isLoggedIn = true;
      }
      else if (res.account_type === 0) {
        this.authLevel = UNLOGGED;
        this.isLoggedIn = false;
      }
      return res;
    });
  }

  isUser() {
    return this.authLevel == USER;
  }

  isEditor() {
    return this.authLevel == EDITOR;
  }

  isAdmin() {
    return this.authLevel == ADMIN;
  }

  isOwner() {
    return this.authLevel == OWNER;
  }

  updateUserData() {
    this.updateUserAuth().subscribe(() => {
      if (this.isLoggedIn) {
        this.http.get<any>('/user/account/get').subscribe((data) => {
          this.userName = data.first_name + ' ' + data.last_name;
          let role = data.account_type;
          this.accountType = role;
          if (role == 1) this.userRole = "korisnik";
          if (role == 2) this.userRole = "urednik";
          if (role == 3) this.userRole = "administrator";
          if (role == 4) this.userRole = "vlasnik";
        });
      }
    });
  }

  logout(): Observable<any> {

    if (this.isLoggedIn) {
      let _logout = this.http.get('/user/auth/signout');
      return _logout.concat(this.updateUserAuth());
    }
    else {
      return Observable.empty();
    }
  }

  loginX(email: string, password: string) {
    var _login = this.http.post<any>('/user/auth/login', { email: email, password: password });

    _login.subscribe(() => this.updateUserData());
  }

  loginAdmin() {
    this.loginX('dito@dito.ninja', '1dominik');
  }

  loginOwner() {
    this.loginX('xdwarrior@gmail.com', 'NeprobojnaLozinka');
  }

  loginEditor() {
    this.loginX('dominik.ivosevic@gmail.com', '1dominik');
  }

  loginUser() {
    this.loginX('dominik.ivosevic@dito.ninja', '1dominik');
  }
}
