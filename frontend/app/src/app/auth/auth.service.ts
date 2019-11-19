import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _isUserAuth: Boolean;
    private _userId: String;

    constructor(private http: HttpClient) {

        this.login();

    }

    get isUserAuth() { return this._isUserAuth }

    get userId() { return this._userId }


    login() {

        this._isUserAuth = true;
        this._userId     = "abc";

    }

    // ToDo
    logout() {}

}
