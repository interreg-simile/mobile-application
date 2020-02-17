import { Component, OnInit } from '@angular/core';
import { Litters } from "../../observation.model";
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    quantity?: number,
    type?: number[]
}


@Component({
    selector   : 'app-litters',
    templateUrl: './litters.component.html',
    styleUrls  : ['./litters.component.scss']
})
export class LittersComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.quantity = this.obsService.newObservation.details.litters.quantity.code;
        // this._props.type     = this.obsService.newObservation.details.litters.type.code;

    }


    onTypeChange(e) {

        console.log(e.detail.checked, e.detail.value);

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
            this.obsService.newObservation.details.litters.checked = true;

            // Save the new values
            this.obsService.newObservation.details.litters.quantity.code = this._props.quantity;
            // this.obsService.newObservation.details.litters.type     = this._props.type;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
