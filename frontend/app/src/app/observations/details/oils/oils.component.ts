import { Component, OnInit } from '@angular/core';
import { Oils } from "../../observation.model";
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    extension?: number,
    type?: number
}


@Component({ selector: 'app-oils', templateUrl: './oils.component.html', styleUrls: ['./oils.component.scss'] })
export class OilsComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.extension = this.obsService.newObservation.details.oils.extension.code;
        this._props.type      = this.obsService.newObservation.details.oils.type.code;

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
            this.obsService.newObservation.details.oils.checked = true;

            // Save the new values
            this.obsService.newObservation.details.oils.extension.code = this._props.extension;
            this.obsService.newObservation.details.oils.type.code      = this._props.type;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }

}
