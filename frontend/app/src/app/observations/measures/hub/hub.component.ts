import * as cloneDeep from "lodash/cloneDeep";
import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";
import { TransparencyComponent } from "../transparency/transparency.component";
import { TemperatureComponent } from "../temperature/temperature.component";
import { PhComponent } from "../ph/ph.component";
import { OxygenComponent } from "../oxygen/oxygen.component";
import { BacteriaComponent } from "../bacteria/bacteria.component";


const DICT_COMPONENTS = {
    transparency: TransparencyComponent,
    temperature : TemperatureComponent,
    ph          : PhComponent,
    oxygen      : OxygenComponent,
    bacteria    : BacteriaComponent
};


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

        // Deep clone the new observation measures
        this._measures = this.obsService.newObservation.measures;

        // ToDo remove
        this.openMeasureModal(this._measures.bacteria.component);

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
     * Closes the modal and eventually submits the observation.
     *
     * @param {boolean} send - True if the observation has to be submitted.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(send: boolean): Promise<void> {

        // Close the modal
        await this.modalCtr.dismiss(send);

    }


}
