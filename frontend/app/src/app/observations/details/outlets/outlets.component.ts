import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    inPlace?: boolean,
    terminal?: number,
    colour?: number,
    vapour?: boolean,
    signage?: boolean,
    signagePhoto?: string,
    prodActNearby?: boolean,
    prodActNearbyDetails?: string
}


@Component({
    selector   : 'app-outlets',
    templateUrl: './outlets.component.html',
    styleUrls  : ['./outlets.component.scss']
})
export class OutletsComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.inPlace              = this.obsService.newObservation.details.outlets.inPlace;
        this._props.terminal             = this.obsService.newObservation.details.outlets.terminal.code;
        this._props.colour               = this.obsService.newObservation.details.outlets.colour.code;
        this._props.vapour               = this.obsService.newObservation.details.outlets.vapour;
        this._props.signage              = this.obsService.newObservation.details.outlets.signage;
        this._props.signagePhoto         = this.obsService.newObservation.details.outlets.signagePhoto;
        this._props.prodActNearby        = this.obsService.newObservation.details.outlets.prodActNearby;
        this._props.prodActNearbyDetails = this.obsService.newObservation.details.outlets.prodActNearbyDetails;
    }


    onHelpClick() { }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean) {

        // If the modifications are to be saved
        if (save) {

            // Set the detail as checked
            this.obsService.newObservation.details.outlets.checked = true;

            // Save the new values
            this.obsService.newObservation.details.outlets.inPlace              = this._props.inPlace;
            this.obsService.newObservation.details.outlets.terminal.code        = this._props.terminal;
            this.obsService.newObservation.details.outlets.colour.code          = this._props.colour;
            this.obsService.newObservation.details.outlets.vapour               = this._props.vapour;
            this.obsService.newObservation.details.outlets.signage              = this._props.signage;
            this.obsService.newObservation.details.outlets.signagePhoto         = this._props.signagePhoto;
            this.obsService.newObservation.details.outlets.prodActNearby        = this._props.prodActNearby;
            this.obsService.newObservation.details.outlets.prodActNearbyDetails = this._props.prodActNearbyDetails;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }

}
