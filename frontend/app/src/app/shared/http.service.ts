import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment.prod";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient, private auth: AuthService) { }

    setAuthorizationHeaders(httpOptions) {

        httpOptions.headers = httpOptions.headers.set("X-API-KEY", `${ environment.apiKey }`);
        httpOptions.headers = httpOptions.headers.set("Authorization", `Bearer ${ this.auth.token }`);

    }

    get(url: string): Observable<any> {

        const httOptions = { headers: new HttpHeaders() };

        this.setAuthorizationHeaders(httOptions);

        return this.http.get(url, httOptions);

    }

}
