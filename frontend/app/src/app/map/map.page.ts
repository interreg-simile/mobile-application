import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from "@ionic/angular";
import { latLng, Map, marker, tileLayer } from 'leaflet';
import { Subscription } from "rxjs";
import { Storage } from "@ionic/storage";

import { MapService } from "./map.service";
import { defaultMarkerIcon } from "../shared/utils";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { LocationErrors } from "../shared/common.enum";


const STORAGE_KEY_POSITION = "position";


const INITIAL_LATLNG = latLng(45.95388572325957, 8.958533937111497);

const INITIAL_ZOOM = 9;

/** Initial and default zoom level of the map. */
const DEFAULT_ZOOM = 18;

/** Minimum level of zoom below which the map is reset to the default level when the GPS button is clicked. */
const MIN_ZOOM = 14;


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
        follows      : false
    };


    private _locationErrors = LocationErrors;

    private _locationError = LocationErrors.NO_ERROR;


    /** User position. */
    public position = { lat: undefined, lon: undefined, accuracy: undefined };


    /** @ignore */
    constructor(private platform: Platform,
                private mapService: MapService,
                private diagnostic: Diagnostic,
                private storage: Storage) { }


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

        });


        this.diagnostic.registerLocationStateChangeHandler(state => {

            if ((this.platform.is("android") && state === this.diagnostic.locationMode.LOCATION_OFF) ||
                (this.platform.is("ios") && state !== this.diagnostic.permissionStatus.GRANTED
                    && state !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)) {

                console.log(`GPS off: ${ state }`);

                this.stopWatchPosition();

                return;

            }

            console.log(`GPS on: ${ state }`);

            this.startWatchPosition();

            return;

        })

    }


    /** @ignore */
    ionViewDidEnter() {

        // this.storage.get(STORAGE_KEY_POSITION).then(v => this.initMap(v));

        this.initMap();

    }


    /** Initializes the Leaflet map. */
    initMap() {

        // Create the map
        this._map = new Map("map", { zoomControl: false });

        // Set the initial view
        this._map.setView(INITIAL_LATLNG, INITIAL_ZOOM);

        // Add OMS as basemap
        tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors' }
        ).addTo(this._map);


        // When the user drags the map, it stops following his position
        this._map.on("dragstart", () => this._mapFlags.follows = false);


        this.startWatchPosition();


        // navigator.geolocation.watchPosition(
        //     data => console.log(data),
        //     err => {
        //         console.error(err);
        //     },
        //     {
        //         timeout           : 3000,
        //         enableHighAccuracy: true,
        //         maximumAge        : 0
        //     }
        // );

    }


    startWatchPosition() {

        this.mapService.startPositionWatch()
            .then(status => {

                console.log("Status: " + LocationErrors[status]);

                this._locationError = status;

                if (this._locationError === LocationErrors.NO_ERROR) {

                    this._mapFlags.follows = true;

                    // Add the user marker to the map
                    this._userMarker = marker([45.466342, 9.185291], { icon: defaultMarkerIcon() }).addTo(this._map);


                    this._positionSub = this.mapService.watchLocation().subscribe(data => {

                        // console.log(data);

                        if (!data.coords) {
                            console.error("Error");
                            return;
                        }

                        this.position.lat = data.coords.latitude;
                        this.position.lon = data.coords.longitude;

                        console.log(this.position.lat, this.position.lon);

                        if (this._mapFlags.follows) this._map.setView([this.position.lat, this.position.lon], DEFAULT_ZOOM);

                        this._userMarker.setLatLng([this.position.lat, this.position.lon]);

                        this._mapFlags.firstPosition = false;

                    });

                }

            })
            .catch(err => console.error(err));

    }


    stopWatchPosition() {

        if (this._positionSub) this._positionSub.unsubscribe();

        this._locationError = LocationErrors.GPS_ERROR;

        if (this._userMarker) this._map.removeLayer(this._userMarker);

        this._mapFlags.follows = false;

    }


    onAddClick() { console.log("Clicked add button") }


    onGPSClick() {

        if (this._locationError !== LocationErrors.NO_ERROR) {

            this.mapService.startPositionWatch(true).catch(err => console.error(err));

            return;

        }

        // If the map is not following the user position
        // if (!this._mapFlags.follows) {
        //
        //     // If the zoom level of the map is less than the minimum one, fly to the user position with the default zoom
        //     if (this._map.getZoom() < MIN_ZOOM)
        //         this._map.flyTo([this.position.lat, this.position.lon], DEFAULT_ZOOM, { animate: false });
        //
        //     // Else, pan to the user position
        //     else this._map.panTo([this.position.lat, this.position.lon], { animate: true });
        //
        //     // Start following the user position
        //     this._mapFlags.follows = true;
        //
        //     // Return
        //     return;
        //
        // }
        //
        // Set the zoom to the default level
        // this._map.setZoom(DEFAULT_ZOOM, { animate: true });

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
