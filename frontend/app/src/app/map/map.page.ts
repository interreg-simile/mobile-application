import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { CircleMarker, LatLng, LeafletMouseEvent, Map, Marker, TileLayer } from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { Subscription } from "rxjs";
import { Storage } from "@ionic/storage";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { NGXLogger } from "ngx-logger";

import { MapService } from "./map.service";
import {
    customMarkerIcon, eventMarkerIcon,
    observationMarkerIcon,
    userMarkerIcon,
    userObservationMarkerIcon
} from "../shared/utils";
import { LocationErrors } from "../shared/common.enum";
import { NewsService } from "../news/news.service";
import { ObservationsService } from "../observations/observations.service";
import { CameraService, PicResult } from "../shared/camera.service";
import { Router } from "@angular/router";
import { Observation } from "../observations/observation.model";
import { TranslateService } from "@ngx-translate/core";
import { Duration, ToastService } from "../shared/toast.service";
import { AuthService } from "../auth/auth.service";


/**
 * Main page of the application. Here the user can visualize herself on a map together with all the observations,
 * measurements and events.
 * From this page the user can navigate to the page designed for the insertion of a new observation.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Component({ selector: 'app-map', templateUrl: './map.page.html', styleUrls: ['./map.page.scss'] })
export class MapPage implements OnInit, OnDestroy {


    private readonly _storageKeyPosition = "position";

    private readonly _initialLagLon = new LatLng(45.95388572325957, 8.958533937111497);

    /** Initial zoom level of the map.  */
    private readonly _initialZoomLvl = 9;

    /** Default zoom level of the map. */
    private readonly _defaultZoomLvl = 16;

    /** Minimum level of zoom below which the map is reset to the default level when the GPS button is clicked. */
    private readonly _minZoomLvl = 14;


    /** @ignore */ private _positionSub: Subscription;
    /** @ignore */ private _pauseSub: Subscription;
    /** @ignore */ private _eventsSub: Subscription;
    /** @ignore */ private _obsSub: Subscription;
    /** @ignore */ private _newEventsSub: Subscription;
    /** @ignore */ private _newAlertsSub: Subscription;


    /** A loading dialog. */
    private loading: HTMLIonLoadingElement;


    /** Leaflet map object. */
    private _map: Map;


    /** Marker for the user position. */
    private _userMarker: Marker;

    /** Circle marker that represents the position accuracy. */
    private _accuracyCircle: CircleMarker;

    /** Marker to sign a custom location selected by a long tap. */
    private _customMarker: Marker;


    /** Flag that states if the position found is the first. */
    private _isFirstPosition = true;

    /** Flag that states if the map center is following the user position. */
    public _isMapFollowing = false;


    /** Local instantiation of the LocationErrors enum. */
    public _locationErrors = LocationErrors;

    /** Current status of the location. */
    public _locationStatus = LocationErrors.NO_ERROR;


    private _eventMarkers: MarkerClusterGroup;
    private _userObsMarkers: MarkerClusterGroup;
    private _obsMarkers: MarkerClusterGroup;

    public _areNewEvents: boolean;
    public _areNewAlerts: boolean;


    /** User position. */
    public position = { lat: undefined, lon: undefined, accuracy: undefined };


    /** @ignore */
    constructor(private logger: NGXLogger,
                private router: Router,
                private i18n: TranslateService,
                private changeRef: ChangeDetectorRef,
                private platform: Platform,
                private mapService: MapService,
                private obsService: ObservationsService,
                private cameraService: CameraService,
                private diagnostic: Diagnostic,
                private storage: Storage,
                private newsService: NewsService,
                private loadingCtr: LoadingController,
                private alertCtr: AlertController,
                private toastService: ToastService,
                private authService: AuthService) { }


    /** @ignore */
    ngOnInit(): void {

        // Register to any application pause event
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


        // Initialize the marker clusters
        this._eventMarkers = new MarkerClusterGroup({
            iconCreateFunction: cluster => {
                const icon             = this._eventMarkers._defaultIconCreateFunction(cluster);
                icon.options.className = "marker-cluster marker-cluster-events";
                return icon;
            }
        });

        this._userObsMarkers = new MarkerClusterGroup({
            iconCreateFunction: cluster => {
                const icon             = this._eventMarkers._defaultIconCreateFunction(cluster);
                icon.options.className = "marker-cluster marker-cluster-user-obs";
                return icon;
            }
        });

        this._obsMarkers = new MarkerClusterGroup({
            iconCreateFunction: cluster => {
                const icon             = this._eventMarkers._defaultIconCreateFunction(cluster);
                icon.options.className = "marker-cluster marker-cluster-obs";
                return icon;
            }
        });

        // Subscribe to new events
        this._eventsSub = this.newsService.events.subscribe(events => {

            // Remove the previous markers
            this._eventMarkers.clearLayers();

            // Create a new marker
            events.forEach(e => {

                const marker = new Marker(e.coordinates, { icon: eventMarkerIcon(), zIndexOffset: 1 });

                // When the user clicks the marker, navigate to the event page
                marker.on("click", () => this.router.navigate(["news/events/", e.id]));

                // Add the marker to the cluster
                marker.addTo(this._eventMarkers);

            })

        });

        // Subscribe to the new observations
        this._obsSub = this.obsService.observations.subscribe(obs => {

            // Remove the previous markers
            this._userObsMarkers.clearLayers();
            this._obsMarkers.clearLayers();

            // For each observation
            obs.forEach(o => {

                // Create a new marker
                const marker = new Marker(
                    new LatLng(o.position.coordinates[1], o.position.coordinates[0]),
                    {
                        icon        : this.authService.userId === o.uid ? userObservationMarkerIcon() : observationMarkerIcon(),
                        zIndexOffset: 2
                    }
                );

                // When the user clicks the marker, navigate to the info page
                marker.on("click", () => this.router.navigate(["/observations", o._id]));

                // Add the marker to the cluster
                marker.addTo(this.authService.userId === o.uid ? this._userObsMarkers : this._obsMarkers);

            })

        });

        // Subscribe to any new alert or event
        this._newEventsSub = this.newsService.areNewEvents.subscribe(v => this._areNewEvents = v);
        this._newAlertsSub = this.newsService.areNewAlerts.subscribe(v => this._areNewAlerts = v);

        // Restore the cached position and init the map
        this.storage.get(this._storageKeyPosition).then(v => this.initMap(v));

    }


    /**
     * Initializes the Leaflet map.
     *
     * @param {Number[]} view - The coordinated on which the map should be centered on creation.
     */
    initMap(view): void {

        // Create the map
        this._map = new Map("map", { zoomControl: false });

        // Set the initial view
        if (view)
            this._map.setView(view, this._defaultZoomLvl);
        else
            this._map.setView(this._initialLagLon, this._initialZoomLvl);

        // Add OMS as basemap
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors' }).addTo(this._map);


        this._eventMarkers.addTo(this._map);
        this._userObsMarkers.addTo(this._map);
        this._obsMarkers.addTo(this._map);


        // When the user drags the map, it stops following his position
        this._map.on("dragstart", () => this._isMapFollowing = false);


        // Fired when the user taps on the map for more than one second
        this._map.on("contextmenu", (ev: LeafletMouseEvent) => {

            // If no custom marker is present, create it
            if (!this._customMarker)
                this._customMarker = new Marker(ev.latlng, { icon: customMarkerIcon() }).addTo(this._map);

            // Else, update its position
            else this._customMarker.setLatLng(ev.latlng);

            // Pan the map to the custom location
            this._map.panTo(ev.latlng);

            // Set the following flag to false
            this._isMapFollowing = false;

        });


        // Fired when the user taps on the map
        this._map.on("click", () => {

            // If no custom marker is present, return
            if (!this._customMarker) return;

            // Remove the custom marker
            this._map.removeLayer(this._customMarker);

            // Set the custom marker to null
            this._customMarker = null;

        });


        // Start the position watcher
        this.startWatcher()
            .catch(err => console.error(err))
            .finally(() => this.populateMap());


    }


    /**
     * Creates and adds to the map a marker at the user position and a circle marker to symbolize the position
     * accuracy.
     *
     * @param {LatLng} latLng - The coordinates of the marker.
     */
    createUserMarker(latLng: LatLng): void {

        // Create the user marker and add it to the map
        this._userMarker = new Marker(latLng, { icon: userMarkerIcon(), zIndexOffset: 3 })
            .addTo(this._map);

        // Create teh accuracy circle and add it to the map
        this._accuracyCircle = new CircleMarker(latLng, { radius: 0, color: "blu", opacity: .5 })
            .addTo(this._map);

    }


    /**
     * Starts the position watcher.
     *
     * @param {boolean} fromClick - True if the request to start the watcher comes from a click action.
     * @returns {Promise<>} - An empty promise.
     */
    async startWatcher(fromClick = false): Promise<void> {

        // Start the position watcher
        const status = await this.mapService.checkPositionAvailability(fromClick);

        console.log(`Trying to start position watching. Status: ${ LocationErrors[status] }`);

        // Save the status
        this._locationStatus = status;
        this.changeRef.detectChanges();


        // If there an error, return
        if (this._locationStatus !== LocationErrors.NO_ERROR) return;


        // Set the map to follow the position
        this._isMapFollowing = true;
        this.changeRef.detectChanges();

        // Subscribe to the location watcher
        this._positionSub = this.mapService.watchLocation().subscribe(data => this.onPositionReceived(data));

    }


    /**
     * Reacts to a new position saving it and updating the map and the user marker.
     *
     * @param {Object} data - The position data received.
     */
    onPositionReceived(data): void {

        // If the data does not contain any coordinate, raise an error and return
        if (!data.coords) {
            console.error("Error");
            return;
        }

        // Save the geo data
        this.position.lat      = data.coords.latitude;
        this.position.lon      = data.coords.longitude;
        this.position.accuracy = data.coords.accuracy;

        // console.log(`[${ this.position.lat }, ${ this.position.lon }] (${ this.position.accuracy })`);

        // If the map is set to follow the user position
        if (this._isMapFollowing) {

            // If its the first found position, set the center and the zoom of the map
            if (this._isFirstPosition)
                this._map.setView([this.position.lat, this.position.lon], this._defaultZoomLvl);

            // Else, set just the center
            else
                this._map.panTo([this.position.lat, this.position.lon]);

        }

        // If there is no user marker, create it
        if (!this._userMarker) this.createUserMarker(new LatLng(this.position.lat, this.position.lon));

        // Else
        else {

            // Set the position of the user marker
            this._userMarker.setLatLng([this.position.lat, this.position.lon]);

            // Set the position and the radius of the accuracy circle
            this._accuracyCircle
                .setLatLng([this.position.lat, this.position.lon])
                .setRadius(this.position.accuracy / 2);

        }

        // Set the first position flag to false
        this._isFirstPosition = false;

    }


    /** Stops the position watcher. */
    stopWatcher(): void {

        console.log("Position watcher stopped");

        // Unsubscribe from the position watcher
        if (this._positionSub) this._positionSub.unsubscribe();

        // Set the status to GPS error
        this._locationStatus = LocationErrors.GPS_ERROR;
        this.changeRef.detectChanges();

        // Remove the user marker and the accuracy circle
        if (this._userMarker) {
            this._map.removeLayer(this._userMarker);
            this._userMarker = null;
        }
        if (this._accuracyCircle) {
            this._map.removeLayer(this._accuracyCircle);
            this._accuracyCircle = null;
        }

        // Set the following flag to false
        this._isMapFollowing = false;
        this.changeRef.detectChanges();

        // Cache the position of the user
        this.cachePosition().catch(err => console.error(`Error caching position: ${ err }`))

    }


    /** Saves the current position of the user in the local storage of the phone. */
    async cachePosition(): Promise<void> {

        if (this.position.lat && this.position.lon)
            await this.storage.set(this._storageKeyPosition, [this.position.lat, this.position.lon]);

    }


    /**
     * Fetches the events and the observations to visualize on the map.
     *
     * @return {Promise<>} An empty promise.
     */
    async populateMap(): Promise<void> {

        // Present the loading alert
        await this.presentLoading();

        // Fetch all the events
        const pEvents = this.newsService.fetchEvents();

        // Fetch all the alert
        const pAlerts = this.newsService.fetchAlerts();

        // Fetch all the observations
        const pObs = this.obsService.fetchObservations();

        // Wait for the two calls to finish
        Promise.all([pEvents, pAlerts, pObs])
            .catch(err => {

                console.error(err);

                // Alert the user
                this.toastService.presentToast("page-map.fetch-error", Duration.short);

            })
            .finally(() => this.dismissLoading());

    }


    /** Response to the user action of clicking on the GPS button. */
    onGPSClick(): void {

        // If a custom marker is present, remove it
        if (this._customMarker) {
            this._map.removeLayer(this._customMarker);
            this._customMarker = null;
        }

        // If there is an error
        if (this._locationStatus !== LocationErrors.NO_ERROR) {

            // Start the position watcher
            this.startWatcher(true).catch(err => console.error(err));

            // Return
            return;

        }

        // If the map is not following the user position
        if (!this._isMapFollowing) {

            // If the zoom level of the map is less than the minimum one, fly to the user position with the default zoom
            if (this._map.getZoom() < this._minZoomLvl)
                this._map.flyTo([this.position.lat, this.position.lon], this._defaultZoomLvl, { animate: false });

            // Else, pan to the user position
            else this._map.panTo([this.position.lat, this.position.lon], { animate: true });

            // Start following the user position
            this._isMapFollowing = true;

            // Return
            return;

        }

        // Set the zoom to the default level
        this._map.setZoom(this._defaultZoomLvl, { animate: true });

    }


    // ToDo
    onSyncClick() { }


    /**
     * Fired when the user clicks on the "add" button. It starts the process of inseting a new observation into the
     * system.
     *
     * @returns {Promise<>} - An empty promise.
     */
    async onAddClick(): Promise<void> {

        // Initialize the position data
        let pos, accuracy, custom;

        // If there is a custom marker
        if (this._customMarker) {
            pos      = this._customMarker.getLatLng(); // Set the position from the custom marker location
            accuracy = 0;                              // Set the accuracy to 0
            custom   = true;                           // Set the custom flag to true
        }

        // Else if there is a user marker
        else if (this._userMarker) {
            pos      = new LatLng(this.position.lat, this.position.lon); // Set the position from the current user position
            accuracy = this.position.accuracy;                           // Set the accuracy to the current accuracy
            custom   = false;                                            // Set the custom flag to false
        }

        // Else
        else {
            await this.toastService.presentToast("page-map.msg-wait-position", Duration.short);
            return;
        }


        // Present the loading dialog
        await this.presentLoading();


        // Check if the point is in a supported location
        const [roi, roiErr] = await this.mapService.pointInRoi(pos)
            .then(v => [v, undefined])
            .catch(e => [undefined, e]);


        // Dismiss the loading dialog
        await this.dismissLoading();


        // If no roi is found and the user clicks on the "cancel" button in the subsequent alert, return
        if (!roi && await this.presentRoiAlert(!!roiErr) === "cancel") return;


        // Create a new observation
        this.obsService.newObservation = new Observation(pos, accuracy, custom);

        // Save the roi
        this.obsService.newObservation.position.roi = roi;


        // Take a picture
        const pic = await this.cameraService.takePicture();

        // If no image has been chosen, return
        if (pic === PicResult.NO_IMAGE) return;

        // If there is an error, alter the user
        if (pic === PicResult.ERROR) await this.toastService.presentToast("common.errors.photo", Duration.short);

        // Else, save the photo
        else this.obsService.newObservation.photos[0] = pic;


        // Open the new observation page
        await this.router.navigate(["/observations/new"]);

        // ToDo do this after completion
        // Remove the custom marker if present
        if (this._customMarker) {
            this._map.removeLayer(this._customMarker);
            this._customMarker = null;
        }

    }


    /**
     * Presents an alert to warn the user that the roi in which the point falls is undefined.
     *
     * @param {boolean} isError - True if the alert is undefined because of an error.
     * @returns {Promise<string>} A promise containing the role of the button clicked.
     */
    async presentRoiAlert(isError: boolean): Promise<string> {

        // Create the alert
        const roiAlert = await this.alertCtr.create({
            header         : this.i18n.instant("common.alerts.header-warning"),
            message        : this.i18n.instant(`page-map.alert-message-roi-${ isError ? 'error' : 'undefined' }`),
            buttons        : [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                { text: this.i18n.instant("common.alerts.btn-continue"), role: "continue" }
            ],
            backdropDismiss: false
        });

        // Present the alert
        await roiAlert.present();

        // Save the data returned by the alert on dismiss
        const data = await roiAlert.onDidDismiss();

        // Return the role of the clicked button
        return data.role

    }


    /**
     * Shows the loading dialog.
     *
     * @returns {Promise<>} - An empty promise.
     */
    async presentLoading(): Promise<void> {

        // Create the loading dialog
        this.loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        // Present the loading dialog
        await this.loading.present();

    }

    /**
     * Dismisses the loading dialog.
     *
     * @returns {Promise<>} - An empty promise.
     */
    async dismissLoading(): Promise<void> {

        // If the dialog is open, dismiss it
        if (this.loading) await this.loading.dismiss();

        // Set the dialog to null
        this.loading = null;

    }


    /** @ignore */
    ngOnDestroy(): void {

        // Stop the position watcher
        this.stopWatcher();

        // Unsubscribe
        if (this._positionSub) this._positionSub.unsubscribe();
        if (this._pauseSub) this._pauseSub.unsubscribe();
        if (this._eventsSub) this._eventsSub.unsubscribe();
        if (this._obsSub) this._obsSub.unsubscribe();
        if (this._newAlertsSub) this._newAlertsSub.unsubscribe();
        if (this._newEventsSub) this._newEventsSub.unsubscribe();

        // Remove the map
        this._map.remove();

    }

}
