import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { Observation } from "../observation.model";
import { ObservationsService } from "../observations.service";


@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit {


    // ToDo delete
    private testCoordinates = [45.860442, 9.383371];


    private _isLoading = false;

    private _newObservation: Observation;

    private skyIcons = {
        1: "wi-day-sunny",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        4: "wi-rain",
        5: "wi-snowflake-cold",
        6: "wi-windy"
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private obsService: ObservationsService,
                private alertCtr: AlertController,
                private loadingCtr: LoadingController,
                private pickerCtr: PickerController,
                private modalCtr: ModalController,
                private i18n: TranslateService) { }


    /** @ignore */
    ngOnInit() {

        this.obsService.newObservation = new Observation();

        // ToDo change with real values
        this.obsService.newObservation.position.coordinates = this.testCoordinates;
        this.obsService.newObservation.position.accuracy    = 2.0;
        this.obsService.newObservation.position.custom      = false;

        this.obsService.newObservation.weather.temperature = 21.4;
        this.obsService.newObservation.weather.sky         = 1;
        this.obsService.newObservation.weather.wind        = 10;

        this._newObservation = this.obsService.newObservation;

        // this.openDetailModel(this._newObservation.details.oils.component);

        // const nominatim = this.obsService.nominatimReverse(this._position.coordinates);
        //
        // Promise.all([nominatim])
        //     .then(res => {
        //
        //         console.log(res);
        //
        //     })
        //     .catch(err => console.error(err))
        //     .finally(() => this._isLoading = false); // ToDo fix

    }


    onHelpClick() {

        console.log(this.obsService.newObservation);

        console.log(this._newObservation);

    }


    async onWeatherClick(name: "temperature" | "wind") {

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

        await alert.present();

    }


    // ToDo
    async onRefreshWeatherClick() {

        const loading = await this.loadingCtr.create({ showBackdrop: false });

        await loading.present();

        // Pull weather data...

        loading.dismiss();

    }


    async onSkyClick() {

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
                selectedIndex: this._newObservation.weather.sky - 1
            }],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-confirm"),
                    handler: data => this._newObservation.weather.sky = data.data.value
                }
            ]
        });

        await picker.present();

    }


    async openDetailModel(component) {

        const modal = await this.modalCtr.create({ component: component });

        await modal.present();

    }


    async onContinueClick() {


        // if (!this._newObservation.position.address)
        //     this.toastService.presentToast("page-new-obs.location.msg-missing-address", Duration.short);


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


// async onLocationEditClick() {
//
//     const alert = await this.alertCtr.create({
//         inputs : [
//             {
//                 name : "address",
//                 type : "text",
//                 value: this._newObservation.position.address ? this._newObservation.position.address : this.i18n.instant("page-new-obs.location.not-recognized")
//             }
//         ],
//         buttons: [
//             { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
//             {
//                 text   : this.i18n.instant("common.alerts.btn-ok"),
//                 handler: data => { this._newObservation.position.address = data.address.trim() }
//             }
//         ]
//     });
//
//     await alert.present();
//
// }
//
//
// async onLocateClick() {
//
//     const loading = await this.loadingCtr.create({ showBackdrop: false });
//
//     await loading.present();
//
//     this.obsService.nominatimReverse(this._newObservation.position.coordinates)
//         .then(addr => this._newObservation.position.address = addr)
//         .catch(() => this._newObservation.position.address = null)
//         .finally(() => loading.dismiss());
//
// }
