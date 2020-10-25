import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable} from 'rxjs';

import {LangService} from '../lang.service';

export class LngInterceptorService implements HttpInterceptor {
  constructor(private langService: LangService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.langService.currLanguage) {
      const newReq = req.clone({
        headers: req.headers.append(
          'Accept-Language',
          this.langService.currLanguage
        ),
      });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
