import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";
import { InstrumentService, SimpleInstrument } from "../instrument/instrument.service";
import { Duration, ToastService } from "../../../shared/toast.service";


interface Props {
    val?: number,
    instrument?: SimpleInstrument
}


@Component({
    selector   : 'app-transparency',
    templateUrl: './transparency.component.html',
    styleUrls  : ['./transparency.component.scss'],
})
export class TransparencyComponent implements OnInit {


    /** Settable properties. */
    public _props: Props = { instrument: {} };


    /** @ignore */
    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private instrumentService: InstrumentService,
                private toastService: ToastService) { }


    /** @ignore */
    ngOnInit(): void {

        // Save the initial values of the settable properties
        this._props.val = this.obsService.newObservation.measures.transparency.val;
        this.instrumentService.setInstrumentProps(this._props.instrument, "transparency");

    }


    // ToDo
    onHelpClick() { console.log(this._props) }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(save: boolean): Promise<void> {

        if (save) {

            // Check the mandatory fields
            if (this._props.val === undefined || this._props.val === null) {
                await this.toastService.presentToast("page-new-obs.measures.transparency.error-msg-val", Duration.short);
                return;
            }

            if (!(await this.instrumentService.checkProps(this._props.instrument))) return;

            // Set the measure as checked
            this.obsService.newObservation.measures.transparency.checked = true;

            // Save the new values
            this.obsService.newObservation.measures.transparency.val = Math.abs(this._props.val);
            this.instrumentService.saveInstrumentProps(this._props.instrument, "transparency");

        }

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
