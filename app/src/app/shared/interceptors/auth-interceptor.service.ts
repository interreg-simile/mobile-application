import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { AuthService } from "../auth.service";

export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      `${req.url.split("/")[0]}//${req.url.split("/")[2]}` !==
      environment.apiBaseUrl
    ) {
      return next.handle(req);
    }

    if (!this.authService.token) {
      return next.handle(req);
    }

    const newReq = req.clone({
      headers: req.headers.append(
        "Authorization",
        `Bearer ${this.authService.token}`
      ),
    });

    return next.handle(newReq);
  }
}
