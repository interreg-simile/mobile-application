import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptorService } from "./auth-interceptor.service";
import { LngInterceptorService } from "./lng-interceptor.service";
import { CorsInterceptorService } from "./cors-interceptor.service";


export const interceptorProviders = [
    // { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LngInterceptorService, multi: true }
];
