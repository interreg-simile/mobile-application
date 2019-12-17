import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";


@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'] })
export class AppComponent {


    /** @ignore */
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private translate: TranslateService
    ) { this.initializeApp() }


    /** Initializes the application. */
    initializeApp() {

        // When the platform is ready
        this.platform.ready().then(() => {

            // Set bg and color of the status bar
            this.statusBar.backgroundColorByHexString("#00515f");
            this.statusBar.styleLightContent();

            // Hide the splash screen
            this.splashScreen.hide();

            // Set the default language
            this.translate.setDefaultLang("en");
            this.translate.use("en");

        });

    }


    // ToDo
    onThematicMap() { console.log("Thematic maps") }

}
