import { Injectable, Injector, Inject, provide } from 'angular2/core';
import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Rx';

import { HttpAdvanced, urlEncode } from './../services/services';

let ACCOUNT_TYPE: string = "accountType";

let UNLOGGED = '-1';
let USER = '1';
let EDITOR = '2';
let ADMIN = '3';
let OWNER = '4';

function errorLogger(err) {
  console.log(err);
}

@Injectable()
export class AuthService {
  private http: Http;
  public isLoggedIn: boolean = false;
  public userRole: string = "";
  public userName: string = "";
  public authLevel: string = UNLOGGED;

  public accountType: number = 0;

  constructor(http: Http) {
    this.http = http;
    this.updateUserData();
  }

  updateUserAuth(): Observable<any> {
    let getType = this.http.get('/user/account/type').map((res) => res.json().data);

    return getType.map((res) => {
      console.log(res);
      if (res.account_type && res.account_type > 0) {
        this.authLevel = res.account_type;
        this.isLoggedIn = true;
      }
      else if (res.account_type === 0) {
        this.authLevel = UNLOGGED;
        this.isLoggedIn = false;
      }
      console.log(this.authLevel);
      console.log(this.isLoggedIn);
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
        this.http.get('/user/account/get').map((res) => res.json().data).subscribe((data) => {
          this.userName = data.first_name + ' ' + data.last_name;
          let role = data.account_type;
          this.accountType = role;
          if (role == 1) this.userRole = "korisnik";
          if (role == 2) this.userRole = "urednik";
          if (role == 3) this.userRole = "administrator";
          if (role == 4) this.userRole = "vlasnik";
        },
        (err) => console.log(err));
      }
    });
  }

  logout(): Observable<any> {
    let _logout = this.http.get('/user/auth/signout');

    if (this.isLoggedIn) {
      _logout.subscribe(() => this.updateUserAuth());
      return _logout;
    }
    else {
      return Observable.empty();
    }
  }

  loginX(mail: string, password: string) {
    var _login = this.http.post('/user/auth/login', urlEncode({ email: mail, password: password }));
    var _logout = this.http.get('/user/auth/signout');

    if (this.isLoggedIn) {
      _logout.subscribe(() => {
        console.log(123); 
        _login.subscribe(() => this.updateUserData(), errorLogger);
      }, errorLogger);
    }
    else {
      _login.subscribe(() => this.updateUserData(), errorLogger);
    }
  }

  loginAdmin() {
    console.log("qweqwe");
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
