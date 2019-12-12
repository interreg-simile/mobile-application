import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { Alert } from "../alert.model";
import { NewsService } from "../../news.service";


@Component({
    selector   : 'app-single-alert',
    templateUrl: './single-alert.page.html',
    styleUrls  : ['./single-alert.page.scss']
})
export class SingleAlertPage implements OnInit {


    /** The alert shown in the page. */
    public alert: Alert;

    /** Current locale of the application. */
    public locale: string;


    /** @ignore */
    constructor(
        private newsService: NewsService,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private i18n: TranslateService
    ) { }


    ngOnInit() {

        // Retrieve the current locale
        this.locale = this.i18n.currentLang;

        // Extract the id from the route
        this.route.paramMap.subscribe(params => {

            // If there is no id, navigate back
            if (!params.has("id")) {
                this.navCtrl.navigateBack("/news", { state: { error: true } });
                return;
            }

            // Get the alert
            this.alert = this.newsService.getAlertById(params.get("id"));

            // If there is no alert, navigate back
            if (!this.alert) {
                this.navCtrl.navigateBack("/news", { state: { error: true } });
                return;
            }

            // Add the alert to the array of read alert in local memory
            this.newsService.addReadAlert(this.alert.id)
                .then(() => this.alert.read = true)
                .catch(err => console.error(err));

        });

    }

}
