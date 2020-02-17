import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    intensity?: number,
    origin?: number[]
}


@Component({ selector: 'app-odours', templateUrl: './odours.component.html', styleUrls: ['./odours.component.scss'] })
export class OdoursComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.intensity = this.obsService.newObservation.details.odours.intensity.code;
        this._props.origin     = [];
        this.obsService.newObservation.details.odours.origin.forEach(t => this._props.origin.push(t.code))

    }


    onHelpClick() { }


    /**
     * Fired when a change event is fired by the origin checkbox group.
     *
     * @param {CustomEvent} e - The change event.
     */
    onTypeChange(e) {

        // If the checkbox has been checked, push its value to the type array
        if (e.detail.checked) this._props.origin.push(parseInt(e.detail.value));

        // Else, remove the element from the array
        else this._props.origin = this._props.origin.filter(t => t !== parseInt(e.detail.value));

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
            this.obsService.newObservation.details.odours.checked = true;

            // Save the new values
            this.obsService.newObservation.details.odours.intensity.code = this._props.intensity;
            this.obsService.newObservation.details.odours.origin = [];
            this._props.origin.forEach(t => this.obsService.newObservation.details.odours.origin.push({code: t}));

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }

}
