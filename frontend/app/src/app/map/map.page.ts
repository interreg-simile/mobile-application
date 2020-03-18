import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Events, LoadingController, Platform, PopoverController } from "@ionic/angular";
import { Circle, LatLng, LeafletMouseEvent, Map, Marker, TileLayer } from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import { Subscription } from "rxjs";
import { Storage } from "@ionic/storage";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { NGXLogger } from "ngx-logger";

import { MapService } from "./map.service";
import { customMarkerIcon, userMarkerIcon } from "../shared/utils";
import { LocationErrors } from "../shared/common.enum";
import { NewsService } from "../news/news.service";
import { ObservationsService } from "../observations/observations.service";
import { CameraService, PicResult } from "../shared/camera.service";
import { Router } from "@angular/router";
import { Observation } from "../observations/observation.model";
import { TranslateService } from "@ngx-translate/core";
import { Duration, ToastService } from "../shared/toast.service";
import { LegendComponent, Markers } from "./legend/legend.component";
import { ConnectionStatus, NetworkService } from "../shared/network.service";


/**
 * Main page of the application. Here the user can visualize herself on a map together with all the observations,
 * measurements and events.
 * From this page the user can navigate to the page designed for the insertion of a new observation.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Component({ selector: 'app-map', templateUrl: './map.page.html', styleUrls: ['./map.page.scss'] })
export class MapPage implements OnInit, OnDestroy {

    private _hasBeenAlreadyOpened = false;

    private readonly _storageKeyPosition = "position";

    private readonly _initialLatLon = new LatLng(45.95388572325957, 8.958533937111497);

    /** Initial zoom level of the map.  */
    private readonly _initialZoomLvl = 9;

    /** Default zoom level of the map. */
    private readonly _defaultZoomLvl = 16;

    /** Minimum level of zoom below which the map is reset to the default level when the GPS button is clicked. */
    private readonly _minZoomLvl = 14;

    private _positionSub: Subscription;
    private _pauseSub: Subscription;
    private _networkSub: Subscription;
    private _eventsSub: Subscription;
    private _obsSub: Subscription;
    private _newEventsSub: Subscription;
    private _newAlertsSub: Subscription;

    private loading: HTMLIonLoadingElement;
    private _map: Map;
    private _userMarker: Marker;
    private _accuracyCircle: Circle;
    private _customMarker: Marker;
    private _isFirstPosition = true;

    private _coords: LatLng;
    private _accuracy: number;

    private _savedMapCenter: LatLng;
    private _savedZoomLevel: number;

    public _isMapFollowing = false;
    public _locationErrors = LocationErrors;
    public _locationStatus = LocationErrors.NO_ERROR;

    private _eventMarkers: MarkerClusterGroup;
    private _obsMarkers: MarkerClusterGroup;

    public _areNewEvents: boolean;
    public _areNewAlerts: boolean;


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
                private popoverCtr: PopoverController,
                private events: Events,
                private networkService: NetworkService) { }


    ngOnInit(): void {

        this._pauseSub = this.platform.pause.subscribe(() => {
            this.cachePosition().catch(err => this.logger.error("Error caching position", err))
        });

        this.diagnostic.registerLocationStateChangeHandler(state => {

            if ((this.platform.is("android") && state === this.diagnostic.locationMode.LOCATION_OFF) ||
                (this.platform.is("ios") && state !== this.diagnostic.permissionStatus.GRANTED
                    && state !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE)) {

                this.stopWatcher();

            } else {
                this.startWatcher().catch(err => this.logger.error("Error starting the watcher", err));
            }

        });

        this.initMarkerClusters();


        this.events.subscribe("popover:change", data => this.onPopoverChange(data.marker, data.checked));

        this.events.subscribe("observation:inserted", () => this._customMarker = null);


        this._eventsSub = this.newsService.events.subscribe(events => {
            this._eventMarkers.clearLayers();
            events.forEach(e => this.mapService.createEventMarker(e).addTo(this._eventMarkers));
        });

        this._obsSub = this.obsService.observations.subscribe(obs => {
            this._obsMarkers.clearLayers();
            obs.forEach(o => this.mapService.createObservationMarker(o).addTo(this._obsMarkers));
        });

        this._newEventsSub = this.newsService.areNewEvents.subscribe(v => this._areNewEvents = v);
        this._newAlertsSub = this.newsService.areNewAlerts.subscribe(v => this._areNewAlerts = v);

    }


    ionViewDidEnter(): void {

        this.initMap()
            .then(() => {

                if (!this._hasBeenAlreadyOpened) {

                    this.startWatcher().catch(err => this.logger.error("Error starting the position watcher.", err));
                    this.populateMap().catch(err => this.logger.error("Error populating the map.", err));

                }

                this._hasBeenAlreadyOpened = true;

            });

    }


    /** Sets the custom icons of the marker clusters. */
    initMarkerClusters(): void {

        this._eventMarkers = new MarkerClusterGroup({
            iconCreateFunction: cluster => {
                const icon             = this._eventMarkers._defaultIconCreateFunction(cluster);
                icon.options.className = "marker-cluster marker-cluster-events";
                return icon;
            }
        });

        this._obsMarkers = new MarkerClusterGroup({
            iconCreateFunction: cluster => {
                const icon             = this._eventMarkers._defaultIconCreateFunction(cluster);
                icon.options.className = "marker-cluster marker-cluster-user-obs";
                return icon;
            }
        });

    }


    /** Initializes the Leaflet map. */
    async initMap(): Promise<void> {

        if (!this._savedMapCenter) {

            const cachedCoords = <Array<number>>await this.storage.get(this._storageKeyPosition);

            if (cachedCoords) {
                this._savedMapCenter = new LatLng(cachedCoords[0], cachedCoords[1]);
                this._savedZoomLevel = this._defaultZoomLvl;
            } else {
                this._savedMapCenter = this._initialLatLon;
                this._savedZoomLevel = this._initialZoomLvl;
            }

        }

        this._map = new Map("map", { zoomControl: false });

        this._map.setView(this._savedMapCenter, this._savedZoomLevel);

        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution: '&copy; OpenStreetMap contributors' })
            .addTo(this._map);


        this._eventMarkers.addTo(this._map);
        this._obsMarkers.addTo(this._map);

        if (this._userMarker) this._userMarker.addTo(this._map);
        if (this._accuracyCircle) this._accuracyCircle.addTo(this._map);
        if (this._customMarker) this._customMarker.addTo(this._map);


        this._map.on("dragstart", () => this._isMapFollowing = false);

        // Fired when the user taps on the map for more than one second
        this._map.on("contextmenu", (ev: LeafletMouseEvent) => {

            if (!this._customMarker)
                this._customMarker = new Marker(ev.latlng, { icon: customMarkerIcon() }).addTo(this._map);
            else
                this._customMarker.setLatLng(ev.latlng);

            this._map.panTo(ev.latlng);

            this._isMapFollowing = false;

        });

        this._map.on("click", () => {

            if (!this._customMarker) return;

            this._map.removeLayer(this._customMarker);

            this._customMarker = null;

        });

    }


    /**
     * Starts the position watcher.
     *
     * @param {boolean} fromClick - True if the request to start the watcher comes from a click action.
     */
    async startWatcher(fromClick = false): Promise<void> {

        this._locationStatus = await this.mapService.checkPositionAvailability(fromClick);
        this.changeRef.detectChanges();

        if (this._locationStatus !== LocationErrors.NO_ERROR) return;

        this._isMapFollowing = true;
        this.changeRef.detectChanges();

        this._positionSub = this.mapService.watchLocation().subscribe(data => this.onPositionReceived(data));

    }

    /** Stops the position watcher. */
    stopWatcher(): void {

        if (this._positionSub) this._positionSub.unsubscribe();

        this._locationStatus = LocationErrors.GPS_ERROR;
        this.changeRef.detectChanges();

        if (this._userMarker) {
            this._map.removeLayer(this._userMarker);
            this._userMarker = null;
        }

        if (this._accuracyCircle) {
            this._map.removeLayer(this._accuracyCircle);
            this._accuracyCircle = null;
        }

        this._isMapFollowing = false;
        this.changeRef.detectChanges();

        this.cachePosition().catch(err => this.logger.error("Error caching the position.", err));

    }


    /**
     * Reacts to a new position saving it and updating the map and the user marker.
     *
     * @param {Object} data - The position data received.
     */
    onPositionReceived(data: any): void {

        // If the data does not contain any coordinate, raise an error and return
        if (!data.coords) {
            this.logger.error("Error form the data emitted by the position watcher.", data);
            return;
        }

        if (!this._coords) {
            this._coords = new LatLng(data.coords.latitude, data.coords.longitude);
        } else {
            this._coords.lat = data.coords.latitude;
            this._coords.lng = data.coords.longitude;
        }

        this._accuracy = data.coords.accuracy;

        if (this._map && this._isMapFollowing) {

            if (this._isFirstPosition) {
                this._map.setView(this._coords, this._defaultZoomLvl);
                this._isFirstPosition = false;
            } else {
                this._map.panTo(this._coords);
            }

        }

        if (!this._userMarker) {
            this.createUserMarker(this._coords);
        } else {
            this._userMarker.setLatLng(this._coords);
            this._accuracyCircle
                .setLatLng(this._coords)
                .setRadius(this._accuracy / 2);
        }

    }


    /**
     * Creates and adds to the map a marker at the user position and a circle marker to symbolize the position
     * accuracy.
     *
     * @param {LatLng} latLng - The coordinates of the marker.
     */
    createUserMarker(latLng: LatLng): void {

        this._userMarker = new Marker(latLng, { icon: userMarkerIcon(), zIndexOffset: 3 }).addTo(this._map);

        this._accuracyCircle = new Circle(latLng, { radius: 0, opacity: .5 }).addTo(this._map);

    }


    /** Fired when the user clicks on the GPS button. */
    onGPSClick(): void {

        if (this._customMarker) {
            this._map.removeLayer(this._customMarker);
            this._customMarker = null;
        }

        if (this._locationStatus !== LocationErrors.NO_ERROR) {
            this.startWatcher(true).catch(err => this.logger.error("Error starting the position watcher.", err));
            return;
        }

        if (!this._isMapFollowing) {

            if (this._map.getZoom() < this._minZoomLvl)
                this._map.flyTo(this._coords, this._defaultZoomLvl, { animate: false });
            else
                this._map.panTo(this._coords, { animate: true });

            this._isMapFollowing = true;

            return;

        }

        this._map.setZoom(this._defaultZoomLvl, { animate: true });

    }

    /** Fired when the user clicks on the synchronize button. */
    async onSyncClick(): Promise<void> {

        if (!this.networkService.checkOnlineContentAvailability()) return;

        await this.populateMap();

        // ToDo checks for locally saved data and sync those with the server

    }


    /** Fetches the data that has to be visualized on the map. */
    async populateMap(): Promise<void> {

        if (!this.networkService.checkOnlineContentAvailability()) return;

        await this.presentLoading();

        const pEvents = this.newsService.fetchEvents();
        const pAlerts = this.newsService.fetchAlerts();
        const pObs    = this.obsService.fetchObservations();

        Promise.all([pEvents, pAlerts, pObs])
            .catch(err => {
                this.logger.error("Error fetching the data.", err);
                this.toastService.presentToast("page-map.fetch-error", Duration.short);
            })
            .finally(() => this.dismissLoading());

    }


    /**
     * Fired when the user clicks on the icon inside of the legend FAB. It redirects the event on the FAB itself so that
     * the popover can be opened in the right position.
     *
     * @param {MouseEvent} e - The click event.
     * @return {boolean} Returns false to prevent the default event.
     */
    onLegendIconClick(e: MouseEvent): boolean {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        const event = document.createEvent("MouseEvent");
        const btn   = document.querySelector("#btn-legend");

        event.initEvent("click", true, true);
        btn.dispatchEvent(event);

        return false;

    }


    /** Fired when the user clicks on the legend button. */
    async onLegendClick(e: MouseEvent): Promise<void> {

        const popover = await this.popoverCtr.create({
            component     : LegendComponent,
            componentProps: {
                hasObsMarkers   : this._map.hasLayer(this._obsMarkers),
                hasEventsMarkers: this._map.hasLayer(this._eventMarkers)
            },
            event         : e,
            showBackdrop  : false
        });

        await popover.present();

    }

    /**
     * Called when a checkbox in the legend popover changes its status.
     *
     * @param {Markers} marker - The marker cluster corresponding to the changed checkbox.
     * @param {boolean} checked - The current state of the checkbox.
     */
    onPopoverChange(marker: Markers, checked: boolean): void {

        switch (marker) {

            case Markers.OTHER_OBSERVATIONS:
                this.toggleMarkerCluster(this._obsMarkers, checked);
                break;

            case Markers.EVENTS:
                this.toggleMarkerCluster(this._eventMarkers, checked);
                break;

        }

    }

    /**
     * Toggles the visibility of a marker cluster.
     *
     * @param {MarkerClusterGroup} cluster - The marker cluster.
     * @param {boolean} toShow - True if the cluster has to be shown.
     */
    toggleMarkerCluster(cluster: MarkerClusterGroup, toShow: boolean): void {

        const hasCluster = this._map.hasLayer(cluster);

        if (toShow && !hasCluster) {
            this._map.addLayer(cluster);
            return;
        }

        if (!toShow && hasCluster) {
            this._map.removeLayer(cluster);
            return;
        }

    }


    /** Fired when the user clicks on the "add" button. */
    async onAddClick(): Promise<void> {

        // ToDo alert user that he is offline
        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
            this.logger.log("Starting new observation with app offline.")
        }


        let pos, accuracy, custom;

        if (this._customMarker) {
            pos      = this._customMarker.getLatLng();
            accuracy = 0;
            custom   = true;
        } else if (this._userMarker) {
            this._map.panTo(this._coords);
            this._isMapFollowing = true;
            pos                  = this._coords;
            accuracy             = this._accuracy;
            custom               = false;
        } else {
            await this.toastService.presentToast("page-map.msg-wait-position", Duration.short);
            return;
        }

        this.obsService.newObservation = new Observation(pos, accuracy, custom);


        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {

            await this.presentLoading();

            const [roi, roiErr] = await this.mapService.pointInRoi(pos)
                .then(v => [v, undefined])
                .catch(e => [undefined, e]);

            await this.dismissLoading();

            if (!roi && await this.presentRoiAlert(!!roiErr) === "cancel") {
                this.obsService.resetNewObservation();
                return;
            }

            this.obsService.newObservation.position.roi = roi;

        }


        const pic = await this.cameraService.takePicture();

        if (pic === PicResult.NO_IMAGE) {
            this.obsService.resetNewObservation();
            return;
        } else if (pic === PicResult.ERROR) {
            await this.toastService.presentToast("common.errors.photo", Duration.short);
        } else {
            this.obsService.newObservation.photos[0] = pic;
        }


        await this.router.navigate(["/observations/new"]);

    }


    /**
     * Presents an alert to warn the user that the roi in which the point falls is undefined.
     *
     * @param {boolean} isError - True if the alert is undefined because of an error.
     * @returns {Promise<string>} A promise containing the role of the button clicked.
     */
    async presentRoiAlert(isError: boolean): Promise<string> {

        const roiAlert = await this.alertCtr.create({
            header         : this.i18n.instant("common.alerts.header-warning"),
            message        : this.i18n.instant(`page-map.alert-message-roi-${ isError ? 'error' : 'undefined' }`),
            buttons        : [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                { text: this.i18n.instant("common.alerts.btn-continue"), role: "continue" }
            ],
            backdropDismiss: false
        });

        await roiAlert.present();

        return (await roiAlert.onDidDismiss()).role;

    }


    /** Shows the loading dialog. */
    async presentLoading(): Promise<void> {

        this.loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        await this.loading.present();

    }

    /** Dismisses the loading dialog. */
    async dismissLoading(): Promise<void> {

        if (this.loading) await this.loading.dismiss();

        this.loading = null;

    }


    /** Saves the current position of the user in the local storage of the phone. */
    async cachePosition(): Promise<void> {

        if (this._coords)
            await this.storage.set(this._storageKeyPosition, [this._coords.lat, this._coords.lng]);

    }


    ionViewWillLeave(): void {

        this._savedMapCenter = this._map.getCenter();
        this._savedZoomLevel = this._map.getZoom();

        this._map.remove();
        this._map = null;

    }


    ngOnDestroy(): void {

        this.stopWatcher();

        if (this._positionSub) this._positionSub.unsubscribe();
        if (this._networkSub) this._networkSub.unsubscribe();
        if (this._pauseSub) this._pauseSub.unsubscribe();
        if (this._eventsSub) this._eventsSub.unsubscribe();
        if (this._obsSub) this._obsSub.unsubscribe();
        if (this._newAlertsSub) this._newAlertsSub.unsubscribe();
        if (this._newEventsSub) this._newEventsSub.unsubscribe();

        this._map.remove();

    }

}
