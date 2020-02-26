import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Map, TileLayer, Marker, LatLng } from "leaflet";

import { Event } from "../event.model";
import { NewsService, STORAGE_KEY_EVENTS } from "../../news.service";
import { environment } from "../../../../environments/environment";
import { defaultMarkerIcon } from "../../../shared/utils";


@Component({
    selector   : 'app-single-event',
    templateUrl: './single-event.page.html',
    styleUrls  : ['./single-event.page.scss'],
})
export class SingleEventPage implements OnInit {


    /** The event shown in the page. */
    public event: Event;

    /** Current locale of the application. */
    public locale: string;


    /** @ignore */
    constructor(
        private newsService: NewsService,
        private activatedRoute: ActivatedRoute,
        private navCtr: NavController,
        private i18n: TranslateService,
        private call: CallNumber
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
        this.event = this.newsService.getEventById(id);

        // If no event id found, navigate back
        if (!this.event) this.navCtr.back();


        // Add the event to the array of read alert in local memory
        this.newsService.saveData(STORAGE_KEY_EVENTS, this.event.id)
            .then(() => {

                // Set the alert as read
                this.event.read = true;

                // Check if there are some unread events
                return this.newsService.checkNewEvents();

            })
            .catch(err => console.error(err));

    }


    /**
     * Opens the phone dial.
     *
     * @return {Promise<>} An empty promise.
     */
    async onPhoneClick(): Promise<void> { await this.call.callNumber(this.event.contacts.phone, false) }


}
