import { Component, OnDestroy, OnInit } from '@angular/core';
import { Map, tileLayer, marker } from 'leaflet';
import { Subscription } from "rxjs";

import { MapService } from "./map.service";
import { userMarkerIcon } from "../shared/utils";


@Component({ selector: 'app-map', templateUrl: './map.page.html', styleUrls: ['./map.page.scss'] })
export class MapPage implements OnInit, OnDestroy {


    /** @ignore */ private _positionSub: Subscription;


    /** Leaflet map object. */
    private _map: Map;

    private _userMarker: marker;


    public position: { lat: Number, lon: Number, accuracy: Number };


    /** @ignore */
    constructor(private mapService: MapService) { }


    /** @ignore */
    ngOnInit() { }


    /** @ignore */
    ionViewDidEnter() { this.initMap() }


    /** Initializes the Leaflet map. */
    initMap() {

        // Create the map
        this._map = new Map("map", { attributionControl: false, zoomControl: false });

        // Set the view
        this._map.setView([45.466342, 9.185291], 16);

        // Add OMS as basemap
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map);


        this._userMarker = marker([45.466342, 9.185291], { icon: userMarkerIcon() });

        this._userMarker.addTo(this._map);


        this._positionSub = this.mapService.watchLocation().subscribe(data => {

            if (!data.coords) {
                console.log("Error");
                return;
            }

            this._map.setView([data.coords.latitude, data.coords.longitude]);

            this._userMarker.setLatLng([data.coords.latitude, data.coords.longitude]);

        })


    }


    onAddClick() { console.log("Clicked add button") }


    onGPSClick() { console.log("Clicked GPS button") }


    /** @ignore */
    ionViewWillLeave() { this._map.remove() }


    /** @ignore */
    ngOnDestroy() {

        if (this._positionSub) this._positionSub.unsubscribe();

    }


}
