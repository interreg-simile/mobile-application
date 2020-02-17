import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    extension?: number,
    look?: number,
    height?: number
}


@Component({ selector: 'app-foams', templateUrl: './foams.component.html', styleUrls: ['./foams.component.scss'] })
export class FoamsComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.extension = this.obsService.newObservation.details.foams.extension.code;
        this._props.look      = this.obsService.newObservation.details.foams.look.code;
        this._props.height    = this.obsService.newObservation.details.foams.height.code;

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean) {

        // If the modifications are to be saved
        if (save) {

            // Set the detail as checked
            this.obsService.newObservation.details.foams.checked = true;

            // Save the new values
            this.obsService.newObservation.details.foams.extension.code = this._props.extension;
            this.obsService.newObservation.details.foams.look.code      = this._props.look;
            this.obsService.newObservation.details.foams.height.code    = this._props.height;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }


    onHelpClick() { }

}
