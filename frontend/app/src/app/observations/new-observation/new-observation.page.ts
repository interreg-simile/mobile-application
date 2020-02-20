import { Component, ComponentRef, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { File } from '@ionic-native/file/ngx';

import { Observation } from "../observation.model";
import { ObservationsService } from "../observations.service";
import { PhotoViewerComponent } from "../../shared/photo-viewer/photo-viewer.component";
import { CameraService, PicResult } from "../../shared/camera.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { LatLng } from "leaflet";


@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit {


    /** Flag that states if the page is loading somethign. */
    private _isLoading = true;

    /** A copy of the new observation created in the ObservationService. */
    private _newObservation: Observation;

    /** A collection of the possible sky icons. */
    private skyIcons = {
        1: "wi-day-sunny",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        4: "wi-rain",
        5: "wi-snowflake-cold",
        6: "wi-windy"
    };

    /** An array containing the sources for the images. */
    private _imageSrc: String[] = [undefined, undefined, undefined];


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private obsService: ObservationsService,
                private alertCtr: AlertController,
                private loadingCtr: LoadingController,
                private pickerCtr: PickerController,
                private modalCtr: ModalController,
                private i18n: TranslateService,
                private cameraService: CameraService,
                private toastService: ToastService,
                private file: File) { }


    /** @ignore */
    ngOnInit(): void {

        // ToDo remove
        this.obsService.newObservation              = new Observation(new LatLng(45.860442, 9.383371), 2.0, false);
        this.obsService.newObservation.position.roi = undefined;
        this.obsService.newObservation.photos[0]    = "https://media.istockphoto.com/photos/lake-water-pollution-picture-id1026572746";

        // Copy the new observation created in the ObservationService
        this._newObservation = this.obsService.newObservation;

        // Get a source from the initial photo
        const imgPromise = this.getImgSrc(this._newObservation.photos[0], 0);

        // Retrieve the weather data
        const weatherPromise = this.getWeatherData(false);

        // Wait for the two promises to resolve (the catch blocks are there to interrupt the fail-fast behaviour)
        Promise.all([
            imgPromise.catch(() => {}),
            weatherPromise.catch(() => {})
        ]).finally(() => this._isLoading = false);

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
                    handler: data => { this._newObservation.weather[name] = data.data }
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
     * Opens a modal for editing a detail.
     *
     * @param {ComponentRef} component - The component to be used as template for the modal.
     * @returns {Promise<>} - An empty promise.
     */
    async openDetailModal(component): Promise<void> {

        // Create the modal
        const modal = await this.modalCtr.create({ component: component });

        // Present the modal
        await modal.present();

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
        await this.getImgSrc(this._newObservation.photos[idx], idx)

    }

    /**
     * Resolves the file corresponded to an image url, computes an image source for the thumbnail and pushes it in the
     * sources array.
     *
     * @param {string} url - The image url.
     * @param {number} idx - The position in the source array.
     */
    async getImgSrc(url, idx): Promise<void> {

        // If a valid url and index have not been passed, return
        if (!url || !idx) return;

        // Extract the file name and the path
        const fileName = url.substring(url.lastIndexOf('/') + 1),
              path     = url.substring(0, url.lastIndexOf('/') + 1);

        // Get the source from the url
        this._imageSrc[idx] = await this.file.readAsDataURL(path, fileName);

    }


    /** Called when the user clicks on the "continue" button. */ // ToDo
    async onContinueClick(): Promise<void> {

        this.obsService.postObservation()
            .catch(err => console.error(err));

        // const modal = await this.modalCtr.create({
        //     component      : ChoicesComponent,
        //     cssClass       : "auto-height",
        //     backdropDismiss: false
        // });
        //
        // await modal.present();

    }


}
