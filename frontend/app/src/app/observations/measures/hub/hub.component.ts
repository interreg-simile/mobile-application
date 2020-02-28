import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";
import { MeasuresImpl } from "../../observation.model";
import { TranslateService } from "@ngx-translate/core";



@Component({ selector: 'app-hub', templateUrl: './hub.component.html', styleUrls: ['./hub.component.scss'] })
export class HubComponent implements OnInit {


    /** Possible measures */
    public _measures;


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private alertCtr: AlertController,
                private i18n: TranslateService) { }


    /** @ignore */
    ngOnInit(): void {

        // Initialize the measures property of the new observation
        this.obsService.newObservation.measures = new MeasuresImpl();

        // Deep clone the new observation measures
        this._measures = this.obsService.newObservation.measures;

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

        if (!send) {

            // Create the alert
            const alert = await this.alertCtr.create({
                message        : this.i18n.instant("page-new-obs.alert-message-cancel"),
                buttons        : [
                    {
                        text   : this.i18n.instant("page-new-obs.alert-btn-cancel"),
                        handler: async () => {
                            await this.modalCtr.dismiss(send);
                            delete this.obsService.newObservation.measures;
                        }
                    },
                    { text: this.i18n.instant("page-new-obs.alert-btn-continue"), role: "cancel" }
                ],
                backdropDismiss: false
            });

            // Present the alert
            await alert.present();

        } else {

            // Close the modal
            await this.modalCtr.dismiss(send);

        }

    }


}
