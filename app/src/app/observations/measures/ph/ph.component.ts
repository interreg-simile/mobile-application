import { Component, OnInit } from '@angular/core';

import { InstrumentService, SimpleInstrument } from "../instrument/instrument.service";
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";
import { Duration, ToastService } from "../../../shared/toast.service";
import { HelpsService } from "../../../shared/helps/helps.service";


interface Props {
    multiple?: boolean,
    singleVal?: { depth: number, val: number },
    multipleVal?: Array<{ depth: number, val: number }>,
    instrument?: SimpleInstrument
}


@Component({ selector: 'app-ph', templateUrl: './ph.component.html', styleUrls: ['./ph.component.scss'] })
export class PhComponent implements OnInit {

    public _props: Props = {
        singleVal  : { val: undefined, depth: undefined },
        multipleVal: [{ val: undefined, depth: undefined }],
        instrument : {}
    };


    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private instrumentService: InstrumentService,
                private toastService: ToastService,
                public helpsService: HelpsService) { }


    ngOnInit(): void {

        this._props.multiple = this.obsService.newObservation.measures.ph.multiple || false;

        this.instrumentService.setInstrumentProps(this._props.instrument, "ph");

        if (this.obsService.newObservation.measures.ph.val.length === 0) return;

        if (!this.obsService.newObservation.measures.ph.multiple) {
            this._props.singleVal = {
                val  : this.obsService.newObservation.measures.ph.val[0].val,
                depth: this.obsService.newObservation.measures.ph.val[0].depth
            };
        } else {
            this._props.multipleVal = [...this.obsService.newObservation.measures.ph.val];
        }

    }


    /**
     * Called when the measure type is changed.
     *
     * @param {CustomEvent} e - The change event.
     */
    onTypeChange(e: CustomEvent): void { this._props.multiple = e.detail.value === "multiple" }


    /** Called when the user clicks on the button to add a new value-depth row. */
    async onAddBtnClick(): Promise<void> {

        if (this._props.multipleVal[this._props.multipleVal.length - 1].val === undefined ||
            this._props.multipleVal[this._props.multipleVal.length - 1].val === null ||
            this._props.multipleVal[this._props.multipleVal.length - 1].depth === undefined ||
            this._props.multipleVal[this._props.multipleVal.length - 1].depth === null) {
            await this.toastService.presentToast("page-new-obs.measures.errors.add-measure", Duration.short);
            return;
        }

        this._props.multipleVal.push({ val: undefined, depth: undefined });

    }

    /** Called when the user clicks on the button to remove the last value-depth row. */
    async onRemoveBtnClick(): Promise<void> {

        if (this._props.multipleVal.length <= 1) {
            await this.toastService.presentToast("page-new-obs.measures.errors.remove-measure", Duration.short);
            return;
        }

        this._props.multipleVal.pop();

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        if (save) {

            if (!(await this.instrumentService.checkProps(this._props.instrument))) return;

            if (!this._props.multiple) {

                if (this._props.singleVal.depth === undefined || this._props.singleVal.depth === null ||
                    this._props.singleVal.val === undefined || this._props.singleVal.val === null) {
                    await this.toastService.presentToast("page-new-obs.measures.ph.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.ph.val = [
                    { val: this._props.singleVal.val, depth: Math.abs(this._props.singleVal.depth) }
                ];

            } else {

                if (this._props.multipleVal.some(v => v.depth === undefined || v.depth === null || v.val === undefined || v.val === null)) {
                    await this.toastService.presentToast("page-new-obs.measures.ph.error-msg-val", Duration.short);
                    return;
                }

                this.obsService.newObservation.measures.ph.val =
                    this._props.multipleVal.map(v => { return { val: v.val, depth: Math.abs(v.depth) } });

            }

            this.obsService.newObservation.measures.ph.multiple = this._props.multiple;
            this.obsService.newObservation.measures.ph.checked = true;
            this.instrumentService.saveInstrumentProps(this._props.instrument, "ph");

        }

        await this.modalCtr.dismiss();

    }
    
}
