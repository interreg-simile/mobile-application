import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { LangService } from "../shared/lang.service";


@Component({
    selector   : 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls  : ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    public _version: string;


    constructor(private appVersion: AppVersion,
                public langService: LangService,
                private alertController: AlertController,
                private i18n: TranslateService) { }


    ngOnInit() {

        this.getAppVersion();

    }


    /** Fired when the user clicks of the language settings. It opens an alert to change the language. */
    async onLangClick(): Promise<void> {

        const createInput = (): Array<any> => {

            const input = [];

            this.langService.supportedLanguages.forEach(lang => {

                input.push({
                    name   : lang,
                    type   : "radio",
                    label  : this.i18n.instant(`page-settings.general.language.${ lang }`),
                    value  : lang,
                    checked: lang === this.langService.currLanguage
                });

            });

            return input;

        };

        const alert = await this.alertController.create({
            header         : this.i18n.instant("page-settings.general.language.header"),
            backdropDismiss: false,
            inputs         : createInput(),
            buttons        : [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => {
                        if (data !== this.langService.currLanguage)
                            this.langService.useLanguage(data);
                    }
                }
            ]
        });

        await alert.present();

    }


    /** Retrieves the app version number. */
    async getAppVersion(): Promise<void> {

        this._version = await this.appVersion.getVersionNumber();

    }


}
