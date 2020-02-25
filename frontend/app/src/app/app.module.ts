import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { IonicStorageModule } from "@ionic/storage";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileType, IModuleTranslationOptions, ModuleTranslateLoader } from "@larscom/ngx-translate-module-loader";

import { PhotoViewerComponent } from "./shared/photo-viewer/photo-viewer.component";
import { interceptorProviders } from "./shared/interceptors/interceptors";


@NgModule({
    declarations   : [AppComponent, PhotoViewerComponent],
    entryComponents: [PhotoViewerComponent],
    imports        : [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: translateLoader, deps: [HttpClient] }
        }),
        IonicStorageModule.forRoot()
    ],
    providers      : [
        StatusBar,
        SplashScreen,
        CallNumber,
        Geolocation,
        Diagnostic,
        Camera,
        File,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        interceptorProviders
    ],
    bootstrap      : [AppComponent]
})
export class AppModule {

    /** @ignore */
    constructor() { registerLocaleData(localeIt, "it") }

}


/**
 * Loads the JSON files with the translations.
 *
 * @param {HttpClient} http - The http client needed to lead the translation.
 */
export function translateLoader(http: HttpClient) {

    // Set the file type
    const fileType = FileType.JSON;

    // Set the base url
    const baseTranslateUrl = "./assets/i18n";

    // Set the loader options
    const opts: IModuleTranslationOptions = {
        nameSpaceUppercase: false,
        modules           : [
            { moduleName: "common", baseTranslateUrl, fileType },
            { moduleName: "page-map", baseTranslateUrl, fileType },
            { moduleName: "page-new-obs", baseTranslateUrl, fileType },
            { moduleName: "page-info-obs", baseTranslateUrl, fileType },
            { moduleName: "page-news", baseTranslateUrl, fileType },
            { moduleName: "page-project", baseTranslateUrl, fileType },
            { moduleName: "page-quiz", baseTranslateUrl, fileType },
            { moduleName: "page-settings", baseTranslateUrl, fileType }
        ]
    };

    // Return the loader
    return new ModuleTranslateLoader(http, opts);

}
