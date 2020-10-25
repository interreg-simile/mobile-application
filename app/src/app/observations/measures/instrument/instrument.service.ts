import {Injectable} from '@angular/core';

import {Duration, ToastService} from '../../../shared/toast.service';
import {ObservationsService} from '../../observations.service';

export interface SimpleInstrument {
  type?: number;
  precision?: number;
  details?: string;
}

@Injectable({providedIn: 'root'})
export class InstrumentService {
  constructor(
    private obsService: ObservationsService,
    private toastService: ToastService
  ) {
  }

  setInstrumentProps(instrument: SimpleInstrument, key: string): void {
    instrument.type = this.obsService.newObservation.measures[
      key
      ].instrument.type.code;
    instrument.precision = this.obsService.newObservation.measures[
      key
      ].instrument.precision;
    instrument.details = this.obsService.newObservation.measures[
      key
      ].instrument.details;
  }

  async checkProps(instrument: SimpleInstrument): Promise<boolean> {
    if (instrument.type !== undefined) {
      return true;
    }

    await this.toastService.presentToast(
      'page-new-obs.measures.instrument.type.error-msg',
      Duration.short
    );

    return false;
  }

  saveInstrumentProps(instrument: SimpleInstrument, key: string): void {
    this.obsService.newObservation.measures[key].instrument.type.code =
      instrument.type;
    this.obsService.newObservation.measures[key].instrument.precision =
      instrument.precision;
    this.obsService.newObservation.measures[key].instrument.details =
      instrument.details;
  }
}
