import { Component, OnInit } from '@angular/core';

import { Details, Position, Weather } from "../observation.model";
import { ObservationsService } from "../observations.service";
import { AlertController, LoadingController, ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ChoicesComponent } from "./choices/choices.component";


@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit {


    // ToDo delete
    private testCoordinates = [45.860442, 9.383371];


    private _isLoading = false;


    private _position: Position = {};

    private _weather: Weather = {};

    private skyIcons = {
        1: "wi-day-sunny",
        2: "wi-day-cloudy",
        3: "wi-cloudy",
        4: "wi-rain",
        5: "wi-snowflake-cold",
        6: "wi-windy"
    };


    private _details = {
        algae  : { checked: false },
        foams  : { checked: false },
        oils   : { checked: false },
        litters: { checked: false },
        odours : { checked: false },
        outlets: { checked: false },
        fauna  : { checked: false },
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

        // ToDo change with real values
        this._position.coordinates = this.testCoordinates;
        this._position.accuracy    = 2.0;
        this._position.custom      = false;

        this._weather.temperature = 21.4;
        this._weather.sky         = { code: 1 };
        this._weather.wind        = 10;

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

        console.log(this._details);

    }


    async onLocationEditClick() {

        const alert = await this.alertCtr.create({
            inputs : [
                {
                    name : "address",
                    type : "text",
                    value: this._position.address ? this._position.address : this.i18n.instant("page-new-obs.location.not-recognized")
                }
            ],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => { this._position.address = data.address }
                }
            ]
        });

        await alert.present();

    }


    onLocateClick() {

        let loading: HTMLIonLoadingElement;

        this.loadingCtr.create({ showBackdrop: false })
            .then(l => {
                loading = l;
                return loading.present()
            })
            .then(() => this.obsService.nominatimReverse(this._position.coordinates))
            .then(addr => this._position.address = addr)
            .catch(err => {
                console.error(err);
                this._position.address = null;
            })
            .finally(() => loading.dismiss())

    }


    async onWeatherClick(name: "temperature" | "wind") {

        const alert = await this.alertCtr.create({
            inputs : [
                {
                    name : "data",
                    type : "number",
                    value: this._weather[name] ? this._weather[name] : 0.0
                }
            ],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => { this._weather[name] = data.data }
                }
            ]
        });

        await alert.present();

    }


    async onSkyClick() {

        const getOpts = () => {

            let opts = [];

            for (let i = 1; i < 7; i++)
                opts.push({ text: this.i18n.instant(`page-new-obs.weather.sky.${ i }`), value: i });

            return opts;

        };

        const picker = await this.pickerCtr.create({
            columns: [{ name: "data", options: getOpts(), selectedIndex: this._weather.sky.code - 1 }],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel", },
                {
                    text   : this.i18n.instant("common.alerts.btn-confirm"),
                    handler: data => this._weather.sky.code = data.data.value
                }
            ]
        });

        await picker.present();

    }


    async onContinueClick() {

        const modal = await this.modalCtr.create(
            {
                component      : ChoicesComponent,
                cssClass       : "auto-height",
                backdropDismiss: false
            }
        );

        await modal.present();

    }


}
