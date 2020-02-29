import { Injectable } from '@angular/core';

import { Duration, ToastService } from "../../../shared/toast.service";
import { ObservationsService } from "../../observations.service";


export interface SimpleInstrument {
    type?: number,
    precision?: number,
    details?: string
}


@Injectable({ providedIn: 'root' })
export class InstrumentService {


    /** @ignore */
    constructor(private obsService: ObservationsService, private toastService: ToastService) { }


    /**
     * Sets the properties of a give instrument from the ones of the current new observation.
     *
     * @param {SimpleInstrument} instrument - The instrument.
     * @param {string} key - The key of the measure.
     */
    setInstrumentProps(instrument: SimpleInstrument, key: string): void {

        instrument.type      = this.obsService.newObservation.measures[key].instrument.type.code;
        instrument.precision = this.obsService.newObservation.measures[key].instrument.precision;
        instrument.details   = this.obsService.newObservation.measures[key].instrument.details;

    }


    /**
     * Checks if a given instrument is valid.
     *
     * @param {SimpleInstrument} instrument - The instrument.
     * @return {Promise<boolean>} A promise containing the result of the check.
     */
    async checkProps(instrument: SimpleInstrument): Promise<boolean> {

        if (instrument.type !== undefined) return true;

        await this.toastService.presentToast("page-new-obs.measures.instrument.type.error-msg", Duration.short);

        return false;

    }


    /**
     * Saves the properties of a give instrument into the current new observation.
     *
     * @param {SimpleInstrument} instrument - The instrument.
     * @param {string} key - The key of the measure.
     */
    saveInstrumentProps(instrument: SimpleInstrument, key: string): void {

        this.obsService.newObservation.measures[key].instrument.type.code = instrument.type;
        this.obsService.newObservation.measures[key].instrument.precision = instrument.precision;
        this.obsService.newObservation.measures[key].instrument.details   = instrument.details;

    }


}
