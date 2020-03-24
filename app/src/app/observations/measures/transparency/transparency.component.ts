import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";
import { InstrumentService, SimpleInstrument } from "../instrument/instrument.service";
import { Duration, ToastService } from "../../../shared/toast.service";
import { HelpsService } from "../../../shared/helps/helps.service";


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

    public _props: Props = { instrument: {} };


    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private instrumentService: InstrumentService,
                private toastService: ToastService,
                public helpsService: HelpsService) { }


    ngOnInit(): void {

        this._props.val = this.obsService.newObservation.measures.transparency.val;
        this.instrumentService.setInstrumentProps(this._props.instrument, "transparency");

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        if (save) {

            if (this._props.val === undefined || this._props.val === null) {
                await this.toastService.presentToast("page-new-obs.measures.transparency.error-msg-val", Duration.short);
                return;
            }

            if (!(await this.instrumentService.checkProps(this._props.instrument))) return;

            this.obsService.newObservation.measures.transparency.checked = true;
            this.obsService.newObservation.measures.transparency.val = Math.abs(this._props.val);
            this.instrumentService.saveInstrumentProps(this._props.instrument, "transparency");

        }

        await this.modalCtr.dismiss();

    }

}
