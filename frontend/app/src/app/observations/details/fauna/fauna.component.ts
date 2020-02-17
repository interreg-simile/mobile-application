import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    deceased?: { fish: boolean, birds: boolean, other: string },
    abnormal?: { fish: boolean, birds: boolean, other: string },
    alienSpecies?: {
        crustaceans: boolean, molluscs: boolean, turtles: boolean, fish: boolean, birds: boolean, other: string
    }
}


@Component({
    selector   : 'app-fauna',
    templateUrl: './fauna.component.html',
    styleUrls  : ['./fauna.component.scss'],
})
export class FaunaComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        this._props.deceased     = this.obsService.newObservation.details.fauna.deceased;
        this._props.abnormal     = this.obsService.newObservation.details.fauna.abnormal;
        this._props.alienSpecies = this.obsService.newObservation.details.fauna.alienSpecies;

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
            this.obsService.newObservation.details.fauna.checked = true;

            // Save the new values
            this.obsService.newObservation.details.fauna.deceased     = this._props.deceased;
            this.obsService.newObservation.details.fauna.abnormal     = this._props.abnormal;
            this.obsService.newObservation.details.fauna.alienSpecies = this._props.alienSpecies;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }

}
