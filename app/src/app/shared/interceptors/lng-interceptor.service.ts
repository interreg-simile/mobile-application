import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { LangService } from "../lang.service";

export class LngInterceptorService implements HttpInterceptor {
  constructor(private langService: LangService) {}

  /**
   * Intercepts an http request and add the headers to it.
   *
   * @param {HttpRequest<any>} req - The request object.
   * @param {HttpHandler} next - The handler that forwards the request.
   * @return {Observable<HttpEvent<any>>} The modified request.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.langService.currLanguage) {
      const newReq = req.clone({
        headers: req.headers.append(
          "Accept-Language",
          this.langService.currLanguage
        ),
      });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
