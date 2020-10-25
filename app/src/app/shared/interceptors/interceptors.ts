import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {LngInterceptorService} from './lng-interceptor.service';
import {AuthInterceptorService} from './auth-interceptor.service';

export const interceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: LngInterceptorService, multi: true},
];
