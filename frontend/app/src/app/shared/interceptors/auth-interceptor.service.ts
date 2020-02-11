import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { AuthService } from "../../auth/auth.service";


/** Intercepts any http request and adds to it the authorization headers needed by the API. */
export class AuthInterceptorService implements HttpInterceptor {


    /** @ignore */
    constructor(private auth: AuthService) {}


    /**
     * Intercepts an http request and add the headers to it.
     *
     * @param {HttpRequest<any>} req - The request object.
     * @param {HttpHandler} next - The handler that forwards the request.
     * @return Observable<HttpEvent<any>>
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // If the request does not come from the API, skip the interceptor
        if (`${req.url.split("/")[0]}//${req.url.split("/")[2]}` !== environment.apiBaseUrl)
            return next.handle(req);

        // Clone the request and the set the headers
        const newReq = req.clone({
            headers: req.headers
                .append("X-API-KEY", `${ environment.apiKey }`)
                .append("Authorization", `Bearer ${ this.auth.token }`)
        });

        // Forward the request
        return next.handle(newReq);

    }

}
