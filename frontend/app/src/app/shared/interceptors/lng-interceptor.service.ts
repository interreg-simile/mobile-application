import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.prod";
import { AuthService } from "../../auth/auth.service";
import { TranslateService } from "@ngx-translate/core";

/**
 * Intercepts any http request and adds to it the correct language headers needed by the API.
 */
export class LngInterceptorService implements HttpInterceptor {

    /** @ignore */
    constructor(private i18n: TranslateService) {}

    /**
     * Intercepts an http request and add the headers to it.
     *
     * @param {HttpRequest<any>} req - The request object.
     * @param {HttpHandler} next - The handler that forwards the request.
     * @return Observable<HttpEvent<any>>
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Initialize the new request
        let newReq = null;

        // If the current language is available, clone the request and the set the headers
        if (this.i18n.currentLang)
            newReq = req.clone({ headers: req.headers.append("Accept-Language", "it") });

        // Forward the request
        return next.handle(newReq || req);

    }

}
