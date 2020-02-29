import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { InstrumentService, SimpleInstrument } from "../instrument/instrument.service";
import { ObservationsService } from "../../observations.service";
import { Duration, ToastService } from "../../../shared/toast.service";


interface Props {
    multiple?: boolean,
    percentage?: boolean,
    singleVal?: { depth: number, val: number },
    multipleVal?: Array<{ depth: number, val: number }>,
    instrument?: SimpleInstrument
}


@Component({ selector: 'app-oxygen', templateUrl: './oxygen.component.html', styleUrls: ['./oxygen.component.scss'] })
export class OxygenComponent implements OnInit {


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
        this._props.multiple   = this.obsService.newObservation.measures.oxygen.multiple || false;
        this._props.percentage = this.obsService.newObservation.measures.oxygen.percentage || false;

        // Set the instrument properties
        this.instrumentService.setInstrumentProps(this._props.instrument, "oxygen");

        // If no value is saved in the observation, return
        if (this.obsService.newObservation.measures.oxygen.val.length === 0) return;

        // If there is a single measure saved
        if (!this.obsService.newObservation.measures.oxygen.multiple) {

            // Save the value
            this._props.singleVal = {
                val  : this.obsService.newObservation.measures.oxygen.val[0].val,
                depth: this.obsService.newObservation.measures.oxygen.val[0].depth
            };

        }

        // Else, if the measure is multiple, save the whole array
        else this._props.multipleVal = [...this.obsService.newObservation.measures.oxygen.val];

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
     * Computes the starting value of the unit.
     *
     * @return {string} The unit.
     */
    computeStartingUnitValue(): string { return this._props.percentage ? "percentage" : "mgl" }

    /**
     * Fired when the user changes the unit.
     *
     * @param {CustomEvent} e - The change event.
     */
    onUnitChange(e: CustomEvent): void { this._props.percentage = e.detail.value === "percentage" }


    /**
     * Called when the user clicks on the button to add a new value-depth row.
     *
     * @return {Promise<>} An empty promise.
     */
    async onAddBtnClick(): Promise<void> {

        // If the last row is not entirely complete, return
        if (this._props.multipleVal[this._props.multipleVal.length - 1].val === undefined ||
            this._props.multipleVal[this._props.multipleVal.length - 1].val === null ||
            this._props.multipleVal[this._props.multipleVal.length - 1].depth === undefined ||
            this._props.multipleVal[this._props.multipleVal.length - 1].depth === null) {
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

                if (this._props.singleVal.depth === undefined || this._props.singleVal.depth === null ||
                    this._props.singleVal.val === undefined || this._props.singleVal.val === null) {
                    await this.toastService.presentToast("page-new-obs.measures.oxygen.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.oxygen.val = [
                    { val: this._props.singleVal.val, depth: Math.abs(this._props.singleVal.depth) }
                ];

            } else {

                if (this._props.multipleVal.some(v => v.depth === undefined || v.depth === null || v.val === undefined || v.val === null)) {
                    await this.toastService.presentToast("page-new-obs.measures.oxygen.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.oxygen.val =
                    this._props.multipleVal.map(v => { return { val: v.val, depth: Math.abs(v.depth) } });

            }

            // Save the measure type
            this.obsService.newObservation.measures.oxygen.multiple = this._props.multiple;
            this.obsService.newObservation.measures.oxygen.percentage = this._props.percentage || false;

            // Set the measure as checked
            this.obsService.newObservation.measures.oxygen.checked = true;

            // Save the instrument information
            this.instrumentService.saveInstrumentProps(this._props.instrument, "oxygen");

        }

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
