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
        this._props.type     = [];
        this.obsService.newObservation.details.litters.type.forEach(t => this._props.type.push(t.code))

    }


    /**
     * Fired when a change event is fired by the type checkbox group.
     *
     * @param {CustomEvent} e - The change event.
     */
    onTypeChange(e) {

        // If the checkbox has been checked, push its value to the type array
        if (e.detail.checked) this._props.type.push(parseInt(e.detail.value));

        // Else, remove the element from the array
        else this._props.type = this._props.type.filter(t => t !== parseInt(e.detail.value));

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
            this.obsService.newObservation.details.litters.type = [];
            this._props.type.forEach(t => this.obsService.newObservation.details.litters.type.push({code: t}));

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
