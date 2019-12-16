import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Map, tileLayer, marker, icon } from "leaflet";

import { Event } from "../event.model";
import { NewsService, STORAGE_KEY_EVENTS } from "../../news.service";
import { environment } from "../../../../environments/environment";
import { Rois } from "../../../shared/common.enum";
import { defaultMarkerIcon } from "../../../shared/utils";


@Component({
    selector   : 'app-single-event',
    templateUrl: './single-event.page.html',
    styleUrls  : ['./single-event.page.scss'],
})
export class SingleEventPage implements OnInit {

    /** The event shown in the page. */
    public event: Event = new Event(
        "5df75bae100fc46e48160af6",
        "Titolo evento",
        "Event title",
        "Et commodo Lorem nulla duis ipsum incididunt pariatur adipisicing ut velit reprehenderit nulla. Occaecat proident est excepteur nostrud veniam laboris non consequat. Occaecat ex incididunt mollit cupidatat cupidatat mollit nostrud pariatur ullamco ut aliquip consectetur cupidatat. Tempor esse labore aliquip elit nulla consectetur non velit ullamco nisi.",
        "Occaecat nulla culpa culpa amet reprehenderit fugiat reprehenderit reprehenderit reprehenderit commodo. Lorem reprehenderit cupidatat do excepteur est in. Mollit deserunt eiusmod adipisicing ullamco qui consequat duis et do aliqua ut. Sit quis sit culpa magna aute quis minim do commodo magna est dolor reprehenderit consequat.",
        { coordinates: [9.077134, 45.82306], type: "Point" },
        { city: "como", civic: "17", country: "italy", main: "Viale Geno", postalCode: 22100, province: "co" },
        [Rois.lake_como],
        new Date(),
        "http://localhost:8000/events/default.jpg",
        { mail: "info@simile.it", phone: "+393349956232" },
        true
    );


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
        private call: CallNumber
    ) { }


    /** @ignore */
    ngOnInit() {

        // Retrieve the current locale
        this.locale = this.i18n.currentLang;

        console.log(this.event)

        // Extract the id from the route
        // this.route.paramMap.subscribe(params => {
        //
        //     // If there is no id, navigate back
        //     if (!params.has("id")) {
        //         this.navCtrl.navigateBack("/news", { state: { error: true } });
        //         return;
        //     }
        //
        //     // Get the alert
        //     this.event = this.newsService.getEventById(params.get("id"));
        //
        //     // If there is no event, navigate back
        //     if (!this.event) {
        //         this.navCtrl.navigateBack("/news", { state: { error: true } });
        //         return;
        //     }
        //
        //     // Append the api url to the image url
        //     this.event.imageUrl = `${ environment.apiUrl }/${ this.event.imageUrl }`;
        //
        //     console.log(this.event);
        //
        //     // Add the alert to the array of read alert in local memory
        //     this.newsService.saveData(STORAGE_KEY_EVENTS, this.event.id)
        //         .then(() => this.event.read = true)
        //         .catch(err => console.error(err));
        //
        // });

    }


    /** @ignore */
    ionViewDidEnter() { this.initMap() }


    /** Initialize the map. */
    initMap() {

        // Create a new map
        this._map = new Map("map", { attributionControl: false });

        const latLng = [this.event.position.coordinates[1], this.event.position.coordinates[0]];

        // Set the map view
        this._map.setView(latLng, 18);

        marker(latLng, { icon: defaultMarkerIcon() })
            .addTo(this._map)
            .bindPopup(latLng.toString())
            .openPopup();

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


    /** @ignore */
    ionViewWillLeave() { this._map.remove() }

}
