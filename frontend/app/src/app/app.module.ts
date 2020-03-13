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
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileType, IModuleTranslationOptions, ModuleTranslateLoader } from "@larscom/ngx-translate-module-loader";
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { PhotoViewerComponent } from "./shared/photo-viewer/photo-viewer.component";
import { interceptorProviders } from "./shared/interceptors/interceptors";
import { environment } from "../environments/environment";
import { HelpModalComponent } from "./shared/helps/help-modal/help-modal.component";
import { HelpPopoverComponent } from "./shared/helps/help-popover/help-popover.component";
import { NgxIonicImageViewerModule } from "ngx-ionic-image-viewer";


@NgModule({
    declarations   : [AppComponent, PhotoViewerComponent, HelpModalComponent, HelpPopoverComponent],
    entryComponents: [PhotoViewerComponent, HelpModalComponent, HelpPopoverComponent],
    imports        : [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        NgxIonicImageViewerModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: translateLoader, deps: [HttpClient] }
        }),
        LoggerModule.forRoot({
            level           : !environment.production ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.OFF,
            serverLogLevel  : NgxLoggerLevel.OFF,
            enableSourceMaps: true,
            timestampFormat : "short"
        })
    ],
    providers      : [
        StatusBar,
        SplashScreen,
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
 * @return {ModuleTranslateLoader} A new ModuleTranslateLoader object.
 */
export function translateLoader(http: HttpClient): ModuleTranslateLoader {

    // Set the file type
    const fileType = FileType.JSON;

    // Set the base url
    const baseTranslateUrl = "./assets/i18n";

    // Set the loader options
    const opts: IModuleTranslationOptions = {
        nameSpaceUppercase: false,
        modules           : [
            { moduleName: "common", baseTranslateUrl, fileType },
            { moduleName: "helps", baseTranslateUrl, fileType },
            { moduleName: "page-map", baseTranslateUrl, fileType },
            { moduleName: "page-new-obs", baseTranslateUrl, fileType },
            { moduleName: "page-info-obs", baseTranslateUrl, fileType },
            { moduleName: "page-news", baseTranslateUrl, fileType },
            { moduleName: "page-project", baseTranslateUrl, fileType },
            { moduleName: "page-settings", baseTranslateUrl, fileType }
        ]
    };

    // Return the loader
    return new ModuleTranslateLoader(http, opts);

}
