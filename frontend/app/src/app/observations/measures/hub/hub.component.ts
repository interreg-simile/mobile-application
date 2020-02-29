import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";


@Component({ selector: 'app-hub', templateUrl: './hub.component.html', styleUrls: ['./hub.component.scss'] })
export class HubComponent implements OnInit {


    /** Possible measures */
    public _measures;


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    /** @ignore */
    ngOnInit(): void {

        this._measures = this.obsService.newObservation.measures;

    }


    /**
     * Called when the user clicks on the checkbox of a measure. It stops the event propagation and uncheck the checkbox
     * or open the detail modal.
     *
     * @param {MouseEvent} e - The click event.
     * @param {Object} measure - The detail object.
     * @return {boolean} It returns false to stop the normal event propagation.
     */
    onMeasureCheckboxClick(e: MouseEvent, measure: any) {

        // Stop the event propagation
        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        // If the detail is not checked, open the modal
        if (!measure.checked) this.openMeasureModal(measure.component);

        // Else, uncheck it
        else measure.checked = false;

        // Return false
        return false;

    }


    /**
     * Opens a modal for editing a measure.
     *
     * @param {Component} component - The component to be used as template for the modal.
     * @returns {Promise<>} An empty promise.
     */
    async openMeasureModal(component: any): Promise<void> {

        // Create the modal
        const modal = await this.modalCtr.create({ component: component });

        // Present the modal
        await modal.present();

    }


    /**
     * Closes the modal.
     *
     * @return {Promise<>} An empty promise.
     */
    async closeModal(): Promise<void> { await this.modalCtr.dismiss() }


}
