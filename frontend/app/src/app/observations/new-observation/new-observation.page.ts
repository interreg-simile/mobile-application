import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, PickerController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

import { ObservationsService } from "../observations.service";
import { PhotoViewerComponent } from "../../shared/photo-viewer/photo-viewer.component";
import { CameraService, PicResult } from "../../shared/camera.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { MeasuresImpl, Observation } from "../observation.model";
import { HubComponent } from "../measures/hub/hub.component";
import { NGXLogger } from "ngx-logger";
import { Subscription } from "rxjs";


@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit, OnDestroy {

    private _backButtonSub: Subscription;

    public _isLoading = true;

    public _newObservation: any;

    public skyIcons = {
        1: "wi-day-sunny",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        4: "wi-rain",
        5: "wi-snowflake-cold",
        6: "wi-windy"
    };

    public _imageSrc: Array<string> = [undefined, undefined, undefined];


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    constructor(private router: Router,
                private obsService: ObservationsService,
                private alertCtr: AlertController,
                private loadingCtr: LoadingController,
                private pickerCtr: PickerController,
                private modalCtr: ModalController,
                private i18n: TranslateService,
                private cameraService: CameraService,
                private toastService: ToastService,
                private platform: Platform,
                private logger: NGXLogger) { }


    ngOnInit(): void {

        this._newObservation = this.obsService.newObservation;
        this._imageSrc[0]    = this.cameraService.getImgSrc(this._newObservation.photos[0]);

        this.getWeatherData(false)
            .catch(() => this.toastService.presentToast("page-map.msg-weather-error", Duration.short))
            .finally(() => this._isLoading = false);

        this._backButtonSub = this.platform.backButton.subscribeWithPriority(999, () => this.onClose());

    }


    // ToDo implement help
    onHelpClick() { }


    /**
     * Retrieves the weather data from the server.
     *
     * @param {boolean} showErr - True if any eventual error should be displayed.
     */
    async getWeatherData(showErr: boolean): Promise<void> {

        const [data, err] = await this.obsService.getWeatherData(this._newObservation.position.coordinates)
            .then(v => [v, undefined])
            .catch(e => [undefined, e]);

        if (err === undefined && data !== undefined) {
            this._newObservation.weather.temperature = Math.round(data.temperature * 10) / 10;
            this._newObservation.weather.sky.code    = data.sky;
            this._newObservation.weather.wind        = Math.round(data.wind * 10) / 10;
            return;
        }

        if (showErr) await this.toastService.presentToast("page-new-obs.weather.err", Duration.short);

    }

    /** Called when the user click on the refresh icon of the weather box. It requests the weather data from the API. */
    async onRefreshWeatherClick(): Promise<void> {

        const loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        await loading.present();

        await this.getWeatherData(true);

        await loading.dismiss();

    }

    /**
     * Called when the user clicks on the "temperature" or "wind" property of the weather box. It opes an alert form
     * which the user can enter a value for the property.
     *
     * @param {"temperature" | "wind"} name - The name of the property.
     */
    async onWeatherClick(name: "temperature" | "wind"): Promise<void> {

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

        await alert.present();

    }

    /** Called when the user clicks on the sky property of the weather box. */
    async onSkyClick(): Promise<void> {

        const getOpts = () => {

            let opts = [];

            for (let i = 1; i < 7; i++)
                opts.push({ text: this.i18n.instant(`page-new-obs.weather.sky.${ i }`), value: i });

            return opts;

        };

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

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        if (!detail.checked)
            this.openDetailModal(detail.component);
        else
            detail.checked = false;

        return false;

    }

    /**
     * Opens a modal for editing a detail.
     *
     * @param {Component} component - The component to be used as template for the modal.
     */
    async openDetailModal(component: any): Promise<void> {

        const modal = await this.modalCtr.create({ component: component });

        await modal.present();

    }


    /** Called when the user clicks on the card to add a new measure. It opens the hub with all the options. */
    async onAddMeasureClick(): Promise<void> {

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
     */
    async onThumbnailClick(src: string, idx: number): Promise<void> {

        if (!src) {
            this.takePhoto(idx);
            return;
        }

        const modal = await this.modalCtr.create({
            component     : PhotoViewerComponent,
            componentProps: { src: src, edit: true, delete: true }
        });

        await modal.present();

        const data = await modal.onDidDismiss();

        if (!data.data) return;

        if (data.data.edit) {
            await this.takePhoto(idx);
        } else if (data.data.delete) {
            this._newObservation.photos[idx] = undefined;
            this._imageSrc[idx]              = undefined;
        }

    }

    /**
     * Takes a photo and assigns it to the given position of the pictures array.
     *
     * @param {number} idx - The position in the array.
     */
    async takePhoto(idx: number): Promise<void> {

        const pic = await this.cameraService.takePicture();

        if (pic === PicResult.ERROR) {
            await this.toastService.presentToast("common.errors.photo", Duration.short);
            return;
        }

        if (pic === PicResult.NO_IMAGE || pic === undefined) return;

        this._newObservation.photos[idx] = pic;

        this._imageSrc[idx] = this.cameraService.getImgSrc(this._newObservation.photos[idx]);

    }


    /** Fired when the user clicks on the send button. */
    async onSendClick(): Promise<void> {

        if (this._newObservation.photos.every(p => p === undefined)) {
            await this.toastService.presentToast("page-new-obs.msg-no-photo", Duration.short);
            return;
        }

        this.postObservation();

    }


    // ToDo implement call to the authorities
    async onAlertClick(): Promise<void> {

        await this.toastService.presentToast("common.msg-to-be-implemented", Duration.short);

        return

    }


    /** Posts the new observation. */
    async postObservation(): Promise<void> {

        const loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        await loading.present();

        let obsErr = undefined;
        await this.obsService.postObservation().catch(err => obsErr = err);

        await loading.dismiss();

        // ToDo give user the possibility to save offline
        if (obsErr) {
            this.logger.error("Error posting the observation.", obsErr);
            const alert = await this.alertCtr.create({
                header : this.i18n.instant("page-new-obs.err-title"),
                message: this.i18n.instant("page-new-obs.err-msg"),
                buttons: [this.i18n.instant("common.alerts.btn-ok")]
            });
            await alert.present();
            return;
        }

        await this.router.navigate(["map"]);

    }


    /** Called when the user wants to close the page without saving the data. */
    async onClose(): Promise<void> {

        try {
            const el = await this.modalCtr.getTop();
            if (el) {
                await el.dismiss();
                return;
            }
        } catch (err) { }

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

        await alert.present();

    }


    ngOnDestroy(): void {

        if (this._backButtonSub && !this._backButtonSub.closed) this._backButtonSub.unsubscribe();

        this.obsService.resetNewObservation();

    }

}
