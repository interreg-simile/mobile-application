import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./auth/auth.service";

@Component({
    selector   : 'app-root',
    templateUrl: 'app.component.html',
    styleUrls  : ['app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private translate: TranslateService,
        private authService: AuthService
    ) { this.initializeApp() }

    initializeApp() {

        this.platform.ready().then(() => {

            this.statusBar.styleDefault();
            this.splashScreen.hide();

            // Set the default language
            this.translate.setDefaultLang("en");
            this.translate.use("en");

        });

    }

    ngOnInit() {}

    // ToDo
    onThematicMap() { console.log("Thematic maps") }

}
