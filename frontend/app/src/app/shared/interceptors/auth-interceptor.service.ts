import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { AuthService } from "../../auth/auth.service";


export class AuthInterceptorService implements HttpInterceptor {

    constructor(private auth: AuthService) {}


    /**
     * Intercepts an http request and add the headers to it.
     *
     * @param {HttpRequest<any>} req - The request object.
     * @param {HttpHandler} next - The handler that forwards the request.
     * @return {Observable<HttpEvent<any>>} The modified request.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (`${req.url.split("/")[0]}//${req.url.split("/")[2]}` !== environment.apiBaseUrl)
            return next.handle(req);

        const newReq = req.clone({
            headers: req.headers
                .append("X-API-KEY", `${ environment.apiKey }`)
                .append("Authorization", `Bearer ${ this.auth.token }`)
        });

        return next.handle(newReq);

    }

}
