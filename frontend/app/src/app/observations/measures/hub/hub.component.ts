import * as cloneDeep from "lodash/cloneDeep";
import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { Measures } from "../../observation.model";
import { ObservationsService } from "../../observations.service";


@Component({ selector: 'app-hub', templateUrl: './hub.component.html', styleUrls: ['./hub.component.scss'] })
export class HubComponent implements OnInit {


    /** Possible measures */
    public measures;


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit(): void {

        // Deep clone the new observation measures
        this.measures = cloneDeep(this.obsService.newObservation.measures);

    }


    /**
     * Opens a modal for editing a measure.
     *
     * @param {ComponentRef} measure - The measure.
     * @returns {Promise<>} An empty promise.
     */
    async openMeasureModal(measure: any): Promise<void> {

        // Deep clone the measures
        const props = cloneDeep(measure);

        // Create the modal
        const modal = await this.modalCtr.create({
            component: measure.component,
            componentProps: {props: props}
        });

        // Present the modal
        await modal.present();

    }


    // ToDo
    onHelpClick() { console.log("On help click") }


    /**
     * Closes the modal and eventually submits the observation.
     *
     * @param {boolean} send - True if the observation has to be submitted.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(send: boolean): Promise<void> {

        // If the observation has to be send, copy the measures
        if (send) this.obsService.newObservation.measures = this.measures;

        // Close the modal
        await this.modalCtr.dismiss(send);

    }


}
