import { Component, QueryList, ViewChildren } from '@angular/core';
import { IonRouterOutlet, MenuController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LangService } from "./shared/lang.service";
import { Router } from "@angular/router";
import { Duration, ToastService } from "./shared/toast.service";


export const statusBarColor = "#00515F";


@Component({ selector: 'app-root', templateUrl: 'app.component.html', styleUrls: ['app.component.scss'] })
export class AppComponent {

    private _lastTimeBackPress = 0;
    private _timePeriodToExit  = 2000;

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;


    constructor(private platform: Platform,
                private splashScreen: SplashScreen,
                private statusBar: StatusBar,
                private langService: LangService,
                private popoverCrt: PopoverController,
                private modalCtr: ModalController,
                private menuCtr: MenuController,
                private toastService: ToastService,
                private router: Router) {

        this.initializeApp();

        this.onBackButton();

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


    /** Called when the hardware back button is clicked. */
    onBackButton() {

        this.platform.backButton.subscribeWithPriority(1, async () => {

            try {
                const el = await this.popoverCrt.getTop();
                if (el) {
                    await el.dismiss();
                    return;
                }
            } catch (err) { }

            try {
                const el = await this.modalCtr.getTop();
                if (el) {
                    await el.dismiss();
                    return;
                }
            } catch (err) { }

            try {
                const el = await this.menuCtr.getOpen();
                if (el) {
                    await this.menuCtr.close();
                    return;
                }
            } catch (err) { }

            this.routerOutlets.forEach((outlet: IonRouterOutlet) => {

                if (outlet && outlet.canGoBack()) {

                    outlet.pop();

                } else if (this.router.url === "map" || !outlet.canGoBack()) {

                    if (new Date().getTime() - this._lastTimeBackPress < this._timePeriodToExit) {
                        navigator["app"].exitApp();
                    } else {
                        this.toastService.presentToast("common.msg-exit-app", Duration.short);
                        this._lastTimeBackPress = new Date().getTime();
                    }

                }

            });

        });

    }

}
