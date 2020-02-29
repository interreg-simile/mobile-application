import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, PickerController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { LatLng } from "leaflet";

import { ObservationsService } from "../observations.service";
import { PhotoViewerComponent } from "../../shared/photo-viewer/photo-viewer.component";
import { CameraService, PicResult } from "../../shared/camera.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { MeasuresImpl, Observation } from "../observation.model";
import { HubComponent } from "../measures/hub/hub.component";


@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit, OnDestroy {


    /** Flag that states if the page is loading something. */
    public _isLoading = true;

    /** A copy of the new observation created in the ObservationService. */
    public _newObservation;

    /** A collection of the possible sky icons. */
    public skyIcons = {
        1: "wi-day-sunny",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        4: "wi-rain",
        5: "wi-snowflake-cold",
        6: "wi-windy"
    };

    /** An array containing the sources for the images. */
    public _imageSrc: Array<string> = [undefined, undefined, undefined];


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private router: Router,
                private obsService: ObservationsService,
                private alertCtr: AlertController,
                private loadingCtr: LoadingController,
                private pickerCtr: PickerController,
                private modalCtr: ModalController,
                private i18n: TranslateService,
                private cameraService: CameraService,
                private toastService: ToastService) { }


    /** @ignore */
    ngOnInit(): void {

        // Copy the new observation created in the ObservationService
        this._newObservation = this.obsService.newObservation;

        // Get a source from the initial photo
        this._imageSrc[0] = this.cameraService.getImgSrc(this._newObservation.photos[0]);

        // Retrieve the weather data
        this.getWeatherData(false)
            .catch(() => this.toastService.presentToast("page-map.msg-weather-error", Duration.short))
            .finally(() => this._isLoading = false);


        // ToDO handle hardware back button
        // When the user click the hardware back button, call the onClose method
        // this.platform.backButton.subscribeWithPriority(9999, () => this.onClose());

    }


    // ToDo
    onHelpClick() { console.log(this.obsService.newObservation) }


    /**
     * Retrieves the weather data from the server.
     *
     * @param {boolean} showErr - True if any eventual error should be displayed.
     * @returns {Promise<>} An empty promise.
     */
    async getWeatherData(showErr: boolean): Promise<void> {

        // Retrieve the weather data
        const [data, err] = await this.obsService.getWeatherData(this._newObservation.position.coordinates)
            .then(v => [v, undefined])
            .catch(e => [undefined, e]);

        // If there is no error and some data are passed
        if (err === undefined && data !== undefined) {

            // Save the data
            this._newObservation.weather.temperature = Math.round(data.temperature * 10) / 10;
            this._newObservation.weather.sky.code    = data.sky;
            this._newObservation.weather.wind        = Math.round(data.wind * 10) / 10;

            // Return
            return;

        }

        if (showErr) await this.toastService.presentToast("page-new-obs.weather.err", Duration.short);

    }

    /**
     * Called when the user click on the refresh icon of the weather box. It requests the weather data from the API.
     *
     * @returns {Promise<>} - An empty promise.
     */
    async onRefreshWeatherClick(): Promise<void> {

        // Create a loading dialog
        const loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        // Present the dialog
        await loading.present();

        // Retrieve the weather data
        await this.getWeatherData(true);

        // Dismiss the loading dialog
        await loading.dismiss();

    }

    /**
     * Called when the user clicks on the "temperature" or "wind" property of the weather box. It opes an alert form
     * which the user can enter a value for the property.
     *
     * @param {"temperature" | "wind"} name - The name of the property.
     * @returns {Promise<>} - An empty promise.
     */
    async onWeatherClick(name: "temperature" | "wind"): Promise<void> {

        // Create the alert
        const alert = await this.alertCtr.create({
            inputs : [
                {
                    name : "data",
                    type : "number",
                    value: this._newObservation.weather[name] ? this._newObservation.weather[name] : 0.0
                }
            ],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => { if (data.data) this._newObservation.weather[name] = data.data }
                }
            ]
        });

        // Present the alert
        await alert.present();

    }

    /**
     * Called when the user clicks on the sky property of the weather box. It allows the user to choose the right
     * sky condition from a picker.
     *
     * @returns {Promise<>} - An empty promise.
     */
    async onSkyClick(): Promise<void> {

        /**
         * Utility function that returns the options for the picker column.
         *
         * @returns {Object} The picker column options.
         */
        const getOpts = () => {

            // Initialize the options
            let opts = [];

            // Push in the options array all the possible sky conditions
            for (let i = 1; i < 7; i++)
                opts.push({ text: this.i18n.instant(`page-new-obs.weather.sky.${ i }`), value: i });

            // Return the options
            return opts;

        };

        // Create the picker
        const picker = await this.pickerCtr.create({
            columns: [{
                name         : "data",
                options      : getOpts(),
                selectedIndex: this._newObservation.weather.sky.code - 1
            }],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-confirm"),
                    handler: data => this._newObservation.weather.sky.code = data.data.value
                }
            ]
        });

        // Present the picker
        await picker.present();

    }


    /**
     * Called when the user clicks on the checkbox of a detail. It stops the event propagation and uncheck the checkbox
     * or open the detail modal.
     *
     * @param {MouseEvent} e - The click event.
     * @param {Object} detail - The detail object.
     * @return {boolean} It returns false to stop the normal event propagation.
     */
    onDetailCheckboxClick(e: MouseEvent, detail: any): boolean {

        // Stop the event propagation
        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        // If the detail is not checked, open the modal
        if (!detail.checked) this.openDetailModal(detail.component);

        // Else, uncheck it
        else detail.checked = false;

        // Return false
        return false;

    }

    /**
     * Opens a modal for editing a detail.
     *
     * @param {Component} component - The component to be used as template for the modal.
     * @returns {Promise<>} An empty promise.
     */
    async openDetailModal(component: any): Promise<void> {

        // Create the modal
        const modal = await this.modalCtr.create({ component: component });

        // Present the modal
        await modal.present();

    }


    /**
     * Called when the user clicks on the card to add a new measure. It opens the hub with all the options.
     *
     * @return {Promise<>} An empty promise.
     */
    async onAddMeasureClick(): Promise<void> {

        // Initialize the measures property of the new observation
        if (!this.obsService.newObservation.measures)
            this.obsService.newObservation.measures = new MeasuresImpl();

        const measuresModal = await this.modalCtr.create({ component: HubComponent });
        await measuresModal.present();

    }


    /**
     * Called when the user click on a photo thumbnail. It opens the image if there is one and it opens the camera if
     * not.
     *
     * @param {string} src - The thumbnail source. If undefined, the camera will be opened.
     * @param {number} idx - The position of the thumbnail source in the pictures array.
     * @returns {Promise<>} - An empty promise.
     */
    async onThumbnailClick(src: string, idx: number): Promise<void> {

        // If no source has been provided, take a photo
        if (!src) {
            this.takePhoto(idx);
            return;
        }


        // Open the image views model
        const modal = await this.modalCtr.create({
            component     : PhotoViewerComponent,
            componentProps: { src: src, edit: true, delete: true }
        });

        // Show the modal
        await modal.present();


        // Get the data passed by the modal dismiss
        const data = await modal.onDidDismiss();


        // If no data is passed, return
        if (!data.data) return;


        // If an edit command has been issued, take a photo
        if (data.data.edit) await this.takePhoto(idx);

        // Else if a delete command has been issued, set the image to null
        else if (data.data.delete) {
            this._newObservation.photos[idx] = undefined;
            this._imageSrc[idx]              = undefined;
        }

    }

    /**
     * Takes a photo and assigns it to the given position of the pictures array.
     *
     * @param {number} idx - The position in the array.
     * @returns {Promise<>} - An empty promise.
     */
    async takePhoto(idx: number): Promise<void> {

        // Take a picture
        const pic = await this.cameraService.takePicture();

        // If there is an error
        if (pic === PicResult.ERROR) {

            // Alert the user
            await this.toastService.presentToast("common.errors.photo", Duration.short);

            // Return
            return;

        }

        // If no picture is provided, return
        if (pic === PicResult.NO_IMAGE || pic === undefined) return;

        // Set the value of the photos array
        this._newObservation.photos[idx] = pic;

        // Compute the source for the thumbnail
        // await this.getImgSrc(this._newObservation.photos[idx], idx)
        this._imageSrc[idx] = this.cameraService.getImgSrc(this._newObservation.photos[idx]);

    }


    /**
     * Fired when the user clicks on the send button. It checks the inserted data and sends the observation to the
     * server.
     *
     * @return {Promise<>} An empty promise.
     */
    async onSendClick(): Promise<void> {

        // If no photo has been provided, alert the user and return
        if (this._newObservation.photos.every(p => p === undefined)) {
            await this.toastService.presentToast("page-new-obs.msg-no-photo", Duration.short);
            return;
        }

        // Post the observation
        this.postObservation();

    }


    // ToDo
    async onAlertClick(): Promise<void> {

        await this.toastService.presentToast("common.msg-to-be-implemented", Duration.short);

        return

    }


    /**
     * Posts the new observation.
     *
     * @return {Promise<>} An empty promise.
     */
    async postObservation(): Promise<void> {

        // Create a loading dialog
        const loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        // Present the dialog
        await loading.present();

        // Initialize the observation error
        let obsErr = undefined;

        // Post the observation
        await this.obsService.postObservation().catch(err => obsErr = err);

        // Dismiss the loading dialog
        await loading.dismiss();

        // If there was an error
        if (obsErr) {

            console.log(obsErr);

            // ToDo give user the possibility to save offline
            // Create an error alert
            const alert = await this.alertCtr.create({
                header : this.i18n.instant("page-new-obs.err-title"),
                message: this.i18n.instant("page-new-obs.err-msg"),
                buttons: [this.i18n.instant("common.alerts.btn-ok")]
            });

            // Present the alert
            await alert.present();

            // Return
            return;

        }

        // Navigate to the map page
        await this.router.navigate(["map"]);

    }


    /**
     * Called when the user wants to close the page without saving the data.
     *
     * @return {Promise<>} An empty promise.
     */
    async onClose(): Promise<void> {

        // Create the alert
        const alert = await this.alertCtr.create({
            message        : this.i18n.instant("page-new-obs.alert-message-cancel"),
            buttons        : [
                {
                    text   : this.i18n.instant("page-new-obs.alert-btn-cancel"),
                    handler: () => this.router.navigate(["map"])
                },
                { text: this.i18n.instant("page-new-obs.alert-btn-continue"), role: "cancel" }
            ],
            backdropDismiss: false
        });

        // Present the alert
        await alert.present();

    }


    /** @ignore */
    ngOnDestroy(): void {

        // Reset the new observation
        this.obsService.resetNewObservation();

    }

}
