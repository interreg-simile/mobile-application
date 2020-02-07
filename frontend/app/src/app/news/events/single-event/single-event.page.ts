import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Map, tileLayer, marker } from "leaflet";

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


    /** Leaflet map object. */
    private _map: Map;


    /** @ignore */
    constructor(
        private newsService: NewsService,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private i18n: TranslateService,
        private call: CallNumber,
        private platform: Platform
    ) { }


    /** @ignore */
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
            this.event = this.newsService.getEventById(params.get("id"));

            // If there is no event, navigate back
            if (!this.event) {
                this.navCtrl.navigateBack("/news", { state: { error: true } });
                return;
            }

            // Append the api url to the image url
            this.event.imageUrl = `${ environment.apiBaseUrl }/${ this.event.imageUrl }`;

            // Add the alert to the array of read alert in local memory
            this.newsService.saveData(STORAGE_KEY_EVENTS, this.event.id)
                .then(() => {

                    // Set the alert as read
                    this.event.read = true;

                    // Check if there are some unread events
                    return this.newsService.checkNewEvents();

                })
                .catch(err => console.error(err));

        });

    }


    /** @ignore */
    ionViewDidEnter() { this.initMap() }


    /** Initialize the map. */
    initMap() {

        // Create a new map
        this._map = new Map("map", { attributionControl: false });

        // Save the coordinates of the point
        const latLng = [this.event.position.coordinates[1], this.event.position.coordinates[0]];

        // Set the map view
        this._map.setView(latLng, 18);

        // Set the content of the address popup
        const popupContent = `
            <span style="text-transform: capitalize">${ this.event.address.main }</span>,
            ${ this.event.address.civic } <br>
            <span style="text-transform: capitalize">${ this.event.address.city }</span>
            (<span style="text-transform: uppercase">${ this.event.address.province }</span>),
            ${ this.event.address.postalCode } <br>
            <span style="text-transform: capitalize">${ this.event.address.country }</span>
        `;

        // Create the popup
        marker(latLng, { icon: defaultMarkerIcon() }).addTo(this._map).bindPopup(popupContent).openPopup();

        // Add OSM basemap
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map);

    }


    /** Opens the phone dial. */
    onPhoneClick() {

        // ToDo add toast in catch
        this.call.callNumber(this.event.contacts.phone, true)
            .then(() => console.log("Call success!"))
            .catch(() => console.error("Error during call"))

    }


    /** Opens the default map application with the event coordinates. */
    onOpenMapClick() {

        // Construct the location
        const location = `${ this.event.position.coordinates[1] },${ this.event.position.coordinates[0] }`;

        // If the platform is android, open Google Map
        if (this.platform.is("android")) {
            window.location.href = `geo:${ location }`;
            return;
        }

        // If the platform is ios, open the native map application
        if (this.platform.is("ios")) {
            window.location.href = `maps://maps.apple.com/?q=${ location }`;
            return;
        }

    }


    /** @ignore */
    ionViewWillLeave() { this._map.remove() }


}
