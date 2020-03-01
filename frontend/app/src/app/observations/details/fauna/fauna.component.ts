import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    deceased?: {
        fish: { checked: boolean, details: string },
        birds: { checked: boolean, details: string },
        other: { checked: boolean, details: string }
    },
    abnormal?: {
        fish: { checked: boolean, details: string },
        birds: { checked: boolean, details: string },
        other: { checked: boolean, details: string }
    },
    alienSpecies?: {
        crustaceans: { checked: boolean, details: string },
        molluscs: { checked: boolean, details: string },
        turtles: { checked: boolean, details: string },
        fish: { checked: boolean, details: string },
        other: { checked: boolean, details: string }
    }
}


@Component({ selector: 'app-fauna', templateUrl: './fauna.component.html', styleUrls: ['./fauna.component.scss'] })
export class FaunaComponent implements OnInit {


    /** Settable properties. */
    public _props: Props = {};


    public _objKeys = Object.keys;

    // Utility function to keep the original key order when iterating on an object using ngFor
    public _originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit() {

        // Save the initial values of the settable properties
        // this._props.deceased     = this.obsService.newObservation.details.fauna.deceased;
        // this._props.abnormal     = this.obsService.newObservation.details.fauna.abnormal;
        // this._props.alienSpecies = this.obsService.newObservation.details.fauna.alienSpecies;

    }


    onHelpClick() { }


    /**
     * Fired when there is a change in the checkboxes of one of the properties.
     *
     * @param {CustomEvent} e - The event.
     * @param {Object} props - The changed property.
     */
    onPropChange(e: CustomEvent, props) { props[e.detail.value].checked = e.detail.checked }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean) {

        // If the modifications are to be saved
        // if (save) {
        //
        //     // Set the detail as checked
        //     this.obsService.newObservation.details.fauna.checked = true;
        //
        //     // Save the new values
        //     Object.keys(this._props).forEach(p => {
        //
        //         Object.keys(this._props[p]).forEach(k => {
        //
        //             this.obsService.newObservation.details.fauna[p][k].checked = this._props[p][k].checked;
        //
        //             this.obsService.newObservation.details.fauna[p][k].details =
        //                 this._props[p][k].checked ? this._props[p][k].details : undefined
        //
        //         })
        //
        //     });
        //
        // }

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
