import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from "./shared/auth-interceptor.service";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { IonicStorageModule } from "@ionic/storage";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';


@NgModule({
    declarations   : [AppComponent],
    entryComponents: [],
    imports        : [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] }
        }),
        IonicStorageModule.forRoot()
    ],
    providers      : [
        StatusBar,
        SplashScreen,
        CallNumber,
        Geolocation,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    ],
    bootstrap      : [AppComponent]
})
export class AppModule {

    /** @ignore */
    constructor() { registerLocaleData(localeIt, "it") }

}


/**
 * Creates the loader needed by the translate service.
 *
 * @param {HttpClient} http - The http client needed to lead the translation.
 */
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
