import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "./utils.interface";
import { Storage } from "@ionic/storage";

interface LoginResponse {
    token: string,
    userId: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    public isGuest: boolean
    public token: string
    public userId: string

    private readonly _storageKeyGuest = "isGuest";
    private readonly _storageKeyToken = "token";
    private readonly _storageKeyUserId = "userId";

    constructor(private http: HttpClient,
                private storage: Storage) { }

    async login(email: string, password: string): Promise<void> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/auth/login`;

        const body = { email, password }

        const res                 = await this.http.post<GenericApiResponse>(url, body).toPromise();
        const data: LoginResponse = res.data

        await this.storage.set(this._storageKeyGuest, false);
        await this.storage.set(this._storageKeyToken, data.token);
        await this.storage.set(this._storageKeyUserId, data.userId);

        this.isGuest = false;
        this.token   = data.token
        this.userId  = data.userId

    }

}
