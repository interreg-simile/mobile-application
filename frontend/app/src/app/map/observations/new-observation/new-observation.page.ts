import { Component, OnInit } from '@angular/core';

import { Details, Position } from "../observation.model";
import { ObservationsService } from "../observations.service";
import { AlertController, LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";


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
                private i18n: TranslateService) { }


    /** @ignore */
    ngOnInit() {

        // ToDo change with real values
        this._position.coordinates = this.testCoordinates;
        this._position.accuracy    = 2.0;
        this._position.custom      = false;

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


    onLocationEditClick() {

        this.alertCtr.create({
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
        })
            .then(alert => alert.present())

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


}
