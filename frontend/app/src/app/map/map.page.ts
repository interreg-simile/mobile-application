import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from "@ionic/angular";
import { Map, tileLayer, marker } from 'leaflet';
import { Subscription } from "rxjs";

import { MapService } from "./map.service";
import { defaultMarkerIcon, userMarkerIcon } from "../shared/utils";


const DEFAULT_ZOOM = 19;

const MAX_ZOOM_DELTA = 9;


@Component({ selector: 'app-map', templateUrl: './map.page.html', styleUrls: ['./map.page.scss'] })
export class MapPage implements OnInit, OnDestroy {


    /** @ignore */ private _positionSub: Subscription;
    /** @ignore */ private _pauseSub: Subscription;
    /** @ignore */ private _resumeSub: Subscription;

    /** Leaflet map object. */
    private _map: Map;

    private _userMarker: marker;

    private _mapFlags = {
        firstPosition: true,
        follows      : true
    };


    public position: { lat: Number, lon: Number, accuracy: Number };


    /** @ignore */
    constructor(private platform: Platform, private mapService: MapService) { }


    /** @ignore */
    ngOnInit() {

        this._resumeSub = this.platform.resume.subscribe(() => {

            // console.log(this._positionSub);

            console.log("resumed");

        });

        this._pauseSub = this.platform.pause.subscribe(() => {

            // this._positionSub.unsubscribe();
            //
            // console.log(this._positionSub);

            console.log("paused");

        })

    }


    /** @ignore */
    ionViewDidEnter() { this.initMap() }


    /** Initializes the Leaflet map. */
    initMap() {

        this.position = { lat: undefined, lon: undefined, accuracy: undefined };

        // Create the map
        this._map = new Map("map", { attributionControl: false, zoomControl: false });

        // Set the view
        this._map.setView([45.466342, 9.185291], DEFAULT_ZOOM);

        // Add OMS as basemap
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map);


        this._userMarker = marker([45.466342, 9.185291], { icon: defaultMarkerIcon() });

        this._userMarker.addTo(this._map);


        this._map.on("dragstart", () => {

            console.log("Map drag");

            this._mapFlags.follows = false;

        });


        this._positionSub = this.mapService.watchLocation().subscribe(data => {

            // if (!data.coords) {
            //     console.log("Error");
            //     return;
            // }

            this.position.lat = data.coords.latitude;
            this.position.lon = data.coords.longitude;

            console.log(this.position.lat, this.position.lon);

            if (this._mapFlags.follows)
                this._map.setView([this.position.lat, this.position.lon]);

            this._userMarker.setLatLng([this.position.lat, this.position.lon]);

            this._mapFlags.firstPosition = false;

        })


    }


    onAddClick() { console.log("Clicked add button") }

    // ToDo zoom

    onGPSClick() {

        // this.mapService.checkGPSPermission()
        //     .catch(err => console.error(err));

        if (DEFAULT_ZOOM - this._map.getZoom() > MAX_ZOOM_DELTA) {

            this._map.flyTo([this.position.lat, this.position.lon], DEFAULT_ZOOM, { animate: true });

            this._mapFlags.follows = true;

            return;
        }

        if (!this._mapFlags.follows) {

            this._map.panTo([this.position.lat, this.position.lon], { animate: true });

            this._mapFlags.follows = true;

        }

    }


    /** @ignore */
    ionViewWillLeave() {

        console.log("Leave");

        if (this._positionSub) this._positionSub.unsubscribe();

        this._map.remove();

    }


    /** @ignore */
    ngOnDestroy() {

        console.log("destroy");

        if (this._positionSub) this._positionSub.unsubscribe();
        if (this._pauseSub) this._pauseSub.unsubscribe();

    }


}
