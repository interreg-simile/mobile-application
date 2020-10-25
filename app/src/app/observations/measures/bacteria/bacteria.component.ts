import {Component, OnInit} from '@angular/core';
import {InstrumentService} from '../instrument/instrument.service';
import {ModalController} from '@ionic/angular';
import {ObservationsService} from '../../observations.service';
import {Duration, ToastService} from '../../../shared/toast.service';
import {HelpsService} from '../../../shared/helps/helps.service';

interface Props {
  escherichiaColi?: number;
  enterococci?: number;
}

@Component({
  selector: 'app-bacteria',
  templateUrl: './bacteria.component.html',
  styleUrls: ['./bacteria.component.scss'],
})
export class BacteriaComponent implements OnInit {
  public _props: Props = {};

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService,
    private instrumentService: InstrumentService,
    private toastService: ToastService,
    public helpsService: HelpsService
  ) {
  }

  ngOnInit(): void {
    this._props.escherichiaColi = this.obsService.newObservation.measures.bacteria.escherichiaColi;
    this._props.enterococci = this.obsService.newObservation.measures.bacteria.enterococci;
  }

  async closeModal(save: boolean): Promise<void> {
    if (save) {
      if (
        (this._props.escherichiaColi === undefined ||
          this._props.escherichiaColi === null) &&
        (this._props.enterococci === undefined ||
          this._props.enterococci === null)
      ) {
        await this.toastService.presentToast(
          'page-new-obs.measures.bacteria.error-msg-val',
          Duration.short
        );
        return;
      }

      this.obsService.newObservation.measures.bacteria.checked = true;
      this.obsService.newObservation.measures.bacteria.escherichiaColi = this._props.escherichiaColi;
      this.obsService.newObservation.measures.bacteria.enterococci = this._props.enterococci;
    }

    await this.modalCtr.dismiss();
  }
}
