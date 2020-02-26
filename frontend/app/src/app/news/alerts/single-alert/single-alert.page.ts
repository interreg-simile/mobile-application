import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { Alert } from "../alert.model";
import { NewsService, STORAGE_KEY_ALERTS, STORAGE_KEY_EVENTS } from "../../news.service";


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
        private activatedRoute: ActivatedRoute,
        private navCtr: NavController,
        private i18n: TranslateService
    ) { }


    /** @ignore */
    ngOnInit(): void {

        // Retrieve the current locale
        this.locale = this.i18n.currentLang;

        // Extract the event id
        const id = this.activatedRoute.snapshot.paramMap.get("id");

        // If no id is passed, navigate back
        if (!id) this.navCtr.back();

        // Find the event
        this.alert = this.newsService.getAlertById(id);

        // If no event id found, navigate back
        if (!this.alert) this.navCtr.back();


        // Add the alert to the array of read alert in local memory
        this.newsService.saveData(STORAGE_KEY_ALERTS, this.alert.id)
            .then(() => {

                // Set the alert as read
                this.alert.read = true;

                // Check if there are some unread events
                return this.newsService.checkNewAlerts();

            })
            .catch(err => console.error(err));

    }

}
