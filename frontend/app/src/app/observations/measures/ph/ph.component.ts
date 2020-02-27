import { Component, OnInit } from '@angular/core';

import { InstrumentService, SimpleInstrument } from "../instrument/instrument.service";
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";
import { Duration, ToastService } from "../../../shared/toast.service";


interface Props {
    multiple?: boolean,
    singleVal?: { depth: number, val: number },
    multipleVal?: Array<{ depth: number, val: number }>,
    instrument?: SimpleInstrument
}


@Component({ selector: 'app-ph', templateUrl: './ph.component.html', styleUrls: ['./ph.component.scss'] })
export class PhComponent implements OnInit {

    /** Measures properties to visualize in the modal. */
    public _props: Props = {
        singleVal  : { val: undefined, depth: undefined },
        multipleVal: [{ val: undefined, depth: undefined }],
        instrument : {}
    };

    
    /** @ignore */
    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private instrumentService: InstrumentService,
                private toastService: ToastService) { }

                
    /** @ignore */
    ngOnInit(): void {

        // Save the initial values of the settable properties
        this._props.multiple = this.obsService.newObservation.measures.ph.multiple || false;

        // Set the instrument properties
        this.instrumentService.setInstrumentProps(this._props.instrument, "ph");

        // If no value is saved in the observation, return
        if (this.obsService.newObservation.measures.ph.val.length === 0) return;

        // If there is a single measure saved
        if (!this.obsService.newObservation.measures.ph.multiple) {

            // Save the value
            this._props.singleVal = {
                val  : this.obsService.newObservation.measures.ph.val[0].val,
                depth: this.obsService.newObservation.measures.ph.val[0].depth
            };

        }

        // Else, if the measure is multiple, save the whole array
        else this._props.multipleVal = [...this.obsService.newObservation.measures.ph.val];

    }


    // ToDo
    onHelpClick() { console.log(this._props) }


    /**
     * Called when the measure type is changed.
     *
     * @param {CustomEvent} e - The change event.
     */
    onTypeChange(e: CustomEvent): void { this._props.multiple = e.detail.value === "multiple" }


    /**
     * Called when the user clicks on the button to add a new value-depth row.
     *
     * @return {Promise<>} An empty promise.
     */
    async onAddBtnClick(): Promise<void> {

        // If the last row is not entirely complete, return
        if (!this._props.multipleVal[this._props.multipleVal.length - 1].val ||
            !this._props.multipleVal[this._props.multipleVal.length - 1].depth) {
            await this.toastService.presentToast("page-new-obs.measures.errors.add-measure", Duration.short);
            return;
        }

        // Add a new row
        this._props.multipleVal.push({ val: undefined, depth: undefined });

    }

    /**
     * Called when the user clicks on the button to remove the last value-depth row.
     *
     * @return {Promise<>} An empty promise.
     */
    async onRemoveBtnClick(): Promise<void> {

        // If it is the last row, return
        if (this._props.multipleVal.length <= 1) {
            await this.toastService.presentToast("page-new-obs.measures.errors.remove-measure", Duration.short);
            return;
        }

        // Remove the last row
        this._props.multipleVal.pop();

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(save: boolean): Promise<void> {

        if (save) {

            // Check if the instrument information are valid
            if (!(await this.instrumentService.checkProps(this._props.instrument))) return;

            // Check if the measure is valid and save it
            if (!this._props.multiple) {

                if (!this._props.singleVal.depth || !this._props.singleVal.val) {
                    await this.toastService.presentToast("page-new-obs.measures.ph.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.ph.val = [
                    { val: this._props.singleVal.val, depth: this._props.singleVal.depth }
                ];

            } else {

                if (this._props.multipleVal.some(v => !v.depth || !v.val)) {
                    await this.toastService.presentToast("page-new-obs.measures.ph.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.ph.val = [...this._props.multipleVal];

            }

            // Save the measure type
            this.obsService.newObservation.measures.ph.multiple = this._props.multiple;

            // Set the measure as checked
            this.obsService.newObservation.measures.ph.checked = true;

            // Save the instrument information
            this.instrumentService.saveInstrumentProps(this._props.instrument, "ph");

        }

        // Close the modal
        await this.modalCtr.dismiss();

    }

    
}
