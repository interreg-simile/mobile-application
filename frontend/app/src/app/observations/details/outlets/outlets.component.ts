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


    /** Selectable colours. */
    private _colours = {
        1: { selected: false, colour: "#D64818" },
        2: { selected: false, colour: "#1060B0" },
        3: { selected: false, colour: "#1F7F16" },
        4: { selected: false, colour: "#888888" },
        5: { selected: false, colour: "#6C4B11" },
        6: { selected: false, colour: "#D7B427" },
        7: { selected: false, colour: "#FFFFFF" }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    private _originalOrder = (a, b) => { return 0 };


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

        // Select the right colour
        if (this._props.colour) this._colours[this._props.colour].selected = true;

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
            this.obsService.newObservation.details.outlets.inPlace       = this._props.inPlace;
            this.obsService.newObservation.details.outlets.terminal.code = this._props.terminal;

            this.obsService.newObservation.details.outlets.colour.code =
                this._props.inPlace ? this._props.colour : undefined;


            this.obsService.newObservation.details.outlets.vapour = this._props.vapour;

            this.obsService.newObservation.details.outlets.signage      = this._props.signage;
            this.obsService.newObservation.details.outlets.signagePhoto =
                this._props.signage ? this._props.signagePhoto : undefined;

            this.obsService.newObservation.details.outlets.prodActNearby        = this._props.prodActNearby;
            this.obsService.newObservation.details.outlets.prodActNearbyDetails =
                this._props.prodActNearby ? this._props.prodActNearbyDetails.trim() : undefined;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }


    /**
     * Handles a change in the selected colour.
     *
     * @param {Object} colour - The selected colour.
     */
    onColourClick(colour) {

        // Set the property to undefined
        this._props.colour = undefined;

        // For each of the possible colours
        Object.keys(this._colours).forEach(c => {

            // If the colours has not been selected or if it was already selected
            if (c !== colour.key || (c === colour.key && this._colours[colour.key].selected)) {

                // Deselect the colour
                this._colours[c].selected = false;

                // Return
                return;

            }

            // Select the colour
            this._colours[c].selected = true;

            // Set the property value
            this._props.colour = colour.key;

        });

    }


    onSignagePhotoClick() {

        console.log("Photo click")

    }


}
