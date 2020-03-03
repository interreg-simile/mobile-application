import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LangService } from "./shared/lang.service";


export const statusBarColor = "#00515F";


@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'] })
export class AppComponent {

    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private langService: LangService) {

        this.initializeApp().catch(() => {});

    }


    /** Initializes the application. */
    async initializeApp(): Promise<void> {

        // When the platform is ready
        await this.platform.ready();

        // Set bg and color of the status bar
        this.statusBar.backgroundColorByHexString(statusBarColor);
        this.statusBar.styleLightContent();

        // Set the application language
        await this.langService.initAppLanguage();

        // Hide the splash screen
        this.splashScreen.hide();

    }

}
