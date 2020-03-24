import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";


@Component({ selector: 'app-hub', templateUrl: './hub.component.html', styleUrls: ['./hub.component.scss'] })
export class HubComponent implements OnInit {

    public _measures;


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    ngOnInit(): void { this._measures = this.obsService.newObservation.measures }


    /**
     * Called when the user clicks on the checkbox of a measure. It stops the event propagation and uncheck the checkbox
     * or open the detail modal.
     *
     * @param {MouseEvent} e - The click event.
     * @param {Object} measure - The detail object.
     * @return {boolean} It returns false to stop the normal event propagation.
     */
    async onMeasureCheckboxClick(e: MouseEvent, measure: any): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        if (!measure.checked)
            await this.openMeasureModal(measure.component);
        else
            measure.checked = false;

    }


    /**
     * Fired when the user clicks on the label of a measure. It opens the modal associated with the measure.
     *
     * @param {MouseEvent} e - The click event.
     * @param {Object} component - The measure component.
     */
    async onMeasureLabelClick(e: MouseEvent, component: any): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        await this.openMeasureModal(component);

    }



    /**
     * Opens a modal for editing a measure.
     *
     * @param {Component} component - The component to be used as template for the modal.
     */
    async openMeasureModal(component: any): Promise<void> {

        const modal = await this.modalCtr.create({ component: component });

        await modal.present();

    }


    /** Closes the modal. */
    async closeModal(): Promise<void> { await this.modalCtr.dismiss() }

}
