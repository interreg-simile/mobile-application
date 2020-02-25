import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class AuthService {

    private _isUserAuth: Boolean;
    private _userId: String;
    private _token: String;

    public rois = ["000000000000000000000001", "000000000000000000000004"];


    constructor() {

        this.login();

    }


    get isUserAuth() { return this._isUserAuth }

    get userId() { return this._userId }

    get token() { return this._token }


    login() {

        this._isUserAuth = true;
        this._userId     = "5dd7bbe0701d5bdd685c1f18";
        this._token      = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGQ3YmJlMDcwMWQ1YmRkNjg1YzFmMTgiLCJpc0FkbWluIjoiZmFsc2UiLCJpYXQiOjE1NzY4MzMyNzMsImV4cCI6MTY2MzIzMzI3M30.yYZLnBkZMoVzwaSg-xs5o8ZQXQkcrQA08cd545ubwDI";

    }

}
