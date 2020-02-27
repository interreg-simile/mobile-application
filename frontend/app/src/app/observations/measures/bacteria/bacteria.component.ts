import { Component, OnInit } from '@angular/core';
import { InstrumentService } from "../instrument/instrument.service";
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";
import { Duration, ToastService } from "../../../shared/toast.service";


interface Props {
    escherichiaColi?: number,
    enterococci?: number
}


@Component({
    selector   : 'app-bacteria',
    templateUrl: './bacteria.component.html',
    styleUrls  : ['./bacteria.component.scss'],
})
export class BacteriaComponent implements OnInit {


    /** Measures properties to visualize in the modal. */
    public _props: Props = {};


    /** @ignore */
    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private instrumentService: InstrumentService,
                private toastService: ToastService) { }


    /** @ignore */
    ngOnInit(): void {

        // Save the initial values of the settable properties
        this._props.escherichiaColi = this.obsService.newObservation.measures.bacteria.escherichiaColi;
        this._props.enterococci     = this.obsService.newObservation.measures.bacteria.enterococci;

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

            // If no value has been inserted, return
            if (!this._props.escherichiaColi && !this._props.enterococci) {
                await this.toastService.presentToast("page-new-obs.measures.bacteria.error-msg-val", Duration.short);
                return;
            }

            // Set the measure as checked
            this.obsService.newObservation.measures.bacteria.checked = true;

            // Save the values
            this.obsService.newObservation.measures.bacteria.escherichiaColi = this._props.escherichiaColi;
            this.obsService.newObservation.measures.bacteria.enterococci     = this._props.enterococci;

        }

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
