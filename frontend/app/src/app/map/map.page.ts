import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController, Platform } from "@ionic/angular";
import { latLng, Map, Marker, TileLayer, CircleMarker, LatLng } from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { Subscription } from "rxjs";
import { Storage } from "@ionic/storage";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";

import { MapService } from "./map.service";
import { defaultMarkerIcon } from "../shared/utils";
import { LocationErrors } from "../shared/common.enum";
import { NewsService } from "../news/news.service";
import { Event } from "../news/events/event.model";
import { ObservationsService } from "../observations/observations.service";


/** Storage key for the cached user position. */
const STORAGE_KEY_POSITION = "position";


/** Initial coordinates of the center of the map. */
const INITIAL_LATLNG = latLng(45.95388572325957, 8.958533937111497);

/** Initial zoom level of the map.  */
const INITIAL_ZOOM = 9;

/** Default zoom level of the map. */
const DEFAULT_ZOOM = 18;

/** Minimum level of zoom below which the map is reset to the default level when the GPS button is clicked. */
const MIN_ZOOM = 14;


/**
 * Main page of the application. Here the user can visualize herself on a map together with all the observations,
 * measurements and events.
 * From this page the user can navigate to the page designed for the insertion of a new observation.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Component({ selector: 'app-map', templateUrl: './map.page.html', styleUrls: ['./map.page.scss'] })
export class MapPage implements OnInit, OnDestroy {


    /** @ignore */ private _positionSub: Subscription;
    /** @ignore */ private _pauseSub: Subscription;
    /** @ignore */ private _eventsSub;
    /** @ignore */ private _obsSub;


    private loading: HTMLIonLoadingElement;


    /** Leaflet map object. */
    private _map: Map;

    private mapHoldTimeout: number;

    /** Marker for the user position. */
    private _userMarker: Marker;

    private _accuracyCircle: CircleMarker;

    /** Flag that states if the position found is the first. */
    private _isFirstPosition = true;

    /** Flag that states if the map center is following the user position. */
    private _isMapFollowing = false;

    /** Local instantiation of the LocationErrors enum. */
    private _locationErrors = LocationErrors;

    /** Current status of the location. */
    private _locationStatus = LocationErrors.NO_ERROR;


    private _eventMarkers: MarkerClusterGroup;

    private _obsMarkers: MarkerClusterGroup;


    /** User position. */
    public position = { lat: undefined, lon: undefined, accuracy: undefined };


    public events: Event[];

    public obs: any[];


    /** @ignore */
    constructor(private changeRef: ChangeDetectorRef,
                private platform: Platform,
                private mapService: MapService,
                private obsService: ObservationsService,
                private diagnostic: Diagnostic,
                private storage: Storage,
                private newsService: NewsService,
                private loadingCtr: LoadingController) { }


    /** @ignore */
    ngOnInit() {

        this._pauseSub = this.platform.pause.subscribe(() => {

            console.log("App paused");

            // Cache the position of the user
            this.cachePosition().catch(err => console.error(`Error caching position: ${ err }`))

        });


        // Register to any change in the location state
        this.diagnostic.registerLocationStateChangeHandler(state => {

            console.log(`GPS state changed to ${ state }`);

            // If the location is not available, stop the position watching
            if ((this.platform.is("android") && state === this.diagnostic.locationMode.LOCATION_OFF) ||
                (this.platform.is("ios") && state !== this.diagnostic.permissionStatus.GRANTED
                    && state !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)) this.stopWatcher();

            // Else, start the position watching
            else this.startWatcher().catch(err => console.error(err));

        });


        // Restore the cached position and init the map
        this.storage.get(STORAGE_KEY_POSITION).then(v => this.initMap(v));

        this._eventMarkers = new MarkerClusterGroup();

        this._obsMarkers = new MarkerClusterGroup();


        this._eventsSub = this.newsService.events.subscribe(events => {

            // console.log(events);

            this.events = events;

            this._eventMarkers.clearLayers();

            this.events.forEach(e => {

                new Marker(
                    new LatLng(e.position.coordinates[0], e.position.coordinates[1]),
                    { icon: defaultMarkerIcon() }
                ).addTo(this._eventMarkers);

            })

        });

        this._obsSub = this.obsService.observations.subscribe(obs => {

            // console.log(obs);

            this.obs = obs;

            this._obsMarkers.clearLayers();

            this.obs.forEach(o => {

                new Marker(
                    new LatLng(o.position.coordinates[0], o.position.coordinates[1]),
                    { icon: defaultMarkerIcon() }
                ).addTo(this._obsMarkers);

            })

        });

    }


    /**
     * Initializes the Leaflet map.
     *
     * @param {Number[]} view - The coordinated on which the map should be centered on creation.
     */
    initMap(view) {

        // Create the map
        this._map = new Map("map", { zoomControl: false });

        // Set the initial view
        if (view)
            this._map.setView(view, DEFAULT_ZOOM);
        else
            this._map.setView(INITIAL_LATLNG, INITIAL_ZOOM);

        // Add OMS as basemap
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors' }).addTo(this._map);


        this._eventMarkers.addTo(this._map);
        this._obsMarkers.addTo(this._map);


        // When the user drags the map, it stops following his position
        this._map.on("dragstart", () => this._isMapFollowing = false);


        // Start the position watcher
        // this.startWatcher()
            // .catch(err => console.error(err))
            // .finally(() => this.populateMap());

    }


    /** Starts the position watcher. */
    async startWatcher() {

        // Start the position watcher
        const status = await this.mapService.checkPositionAvailability();

        console.log(`Trying to start position watching. Status: ${ LocationErrors[status] }`);

        // Save the status
        this._locationStatus = status;
        this.changeRef.detectChanges();


        // If there an error, return
        if (this._locationStatus !== LocationErrors.NO_ERROR) return;


        // Set the map to follow the position
        this._isMapFollowing = true;
        this.changeRef.detectChanges();

        // Add the user marker to the map
        this._userMarker = new Marker([45.466342, 9.185291], { icon: defaultMarkerIcon() }).addTo(this._map);

        // Add the accuracy circle to the map
        this._accuracyCircle = new CircleMarker([45.466342, 9.185291],
            { radius: 0, color: "green", opacity: .5 }).addTo(this._map);


        // Subscribe to the location watcher
        this._positionSub = this.mapService.watchLocation().subscribe(data => this.onPositionReceived(data));

    }


    onPositionReceived(data) {

        // If the data does not contain any coordinate, raise an error and return
        if (!data.coords) {
            console.error("Error");
            return;
        }

        // Save the geo data
        this.position.lat      = data.coords.latitude;
        this.position.lon      = data.coords.longitude;
        this.position.accuracy = data.coords.accuracy;

        console.log(`[${ this.position.lat }, ${ this.position.lon }] (${ this.position.accuracy })`);

        // If the map is set to follow the user position
        if (this._isMapFollowing) {

            // If its the first found position, set the center and the zoom of the map
            if (this._isFirstPosition)
                this._map.setView([this.position.lat, this.position.lon], DEFAULT_ZOOM);

            // Else, set just the center
            else
                this._map.panTo([this.position.lat, this.position.lon]);

        }

        // Set the position of the user marker
        this._userMarker.setLatLng([this.position.lat, this.position.lon]);

        // Set the position and the radius of the accuracy circle
        this._accuracyCircle
            .setLatLng([this.position.lat, this.position.lon])
            .setRadius(this.position.accuracy / 2);

        // Set the first position flag to false
        this._isFirstPosition = false;

    }


    /** Stops the position watcher. */
    stopWatcher() {

        console.log("Position watcher stopped");

        // Unsubscribe from the position watcher
        if (this._positionSub) this._positionSub.unsubscribe();

        // Set the status to GPS error
        this._locationStatus = LocationErrors.GPS_ERROR;
        this.changeRef.detectChanges();

        // Remove the user marker and the accuracy circle
        if (this._userMarker) this._map.removeLayer(this._userMarker);
        if (this._accuracyCircle) this._map.removeLayer(this._accuracyCircle);

        // Set the following flag to false
        this._isMapFollowing = false;
        this.changeRef.detectChanges();

        // Cache the position of the user
        this.cachePosition().catch(err => console.error(`Error caching position: ${ err }`))

    }


    /** Saves the current position of the user in the local storage of the phone. */
    async cachePosition() {

        console.log("Caching position...");

        if (this.position.lat && this.position.lon)
            await this.storage.set(STORAGE_KEY_POSITION, [this.position.lat, this.position.lon]);

    }


    async populateMap() {

        this.presentLoading();

        const pEvents = this.newsService.fetchEvents();
        const pObs    = this.obsService.fetchObservations();

        Promise.all([pEvents, pObs])
            .then(() => console.log("Done!"))
            .catch(err => console.error(err))
            .finally(() => this.dismissLoading());

    }


    /** Response to the user action of clicking on the GPS button. */
    onGPSClick() {

        // If there is an error
        if (this._locationStatus !== LocationErrors.NO_ERROR) {

            // Start the position watcher
            this.mapService.checkPositionAvailability(true).catch(err => console.error(err));

            // Return
            return;

        }

        // If the map is not following the user position
        if (!this._isMapFollowing) {

            // If the zoom level of the map is less than the minimum one, fly to the user position with the default zoom
            if (this._map.getZoom() < MIN_ZOOM)
                this._map.flyTo([this.position.lat, this.position.lon], DEFAULT_ZOOM, { animate: false });

            // Else, pan to the user position
            else this._map.panTo([this.position.lat, this.position.lon], { animate: true });

            // Start following the user position
            this._isMapFollowing = true;

            // Return
            return;

        }

        // Set the zoom to the default level
        this._map.setZoom(DEFAULT_ZOOM, { animate: true });

    }


    onSyncClick() {

        this.mapService.pointInRois();

    }


    async presentLoading() {

        this.loading = await this.loadingCtr.create({ message: "Test", showBackdrop: false });

        await this.loading.present();

    }

    async dismissLoading() {

        if (this.loading) await this.loading.dismiss();

        this.loading = null;

    }


    /** @ignore */
    ngOnDestroy() {

        console.log("View destroyed");

        // Stop the position watcher
        this.stopWatcher();

        // Unsubscribe
        if (this._pauseSub) this._pauseSub.unsubscribe();
        // if (this._eventsSub) this._eventsSub.unsubscribe();

        // Remove the map
        this._map.remove();

    }


}
