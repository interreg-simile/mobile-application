import {Component, OnInit} from '@angular/core';
import {Oils} from '../../observation.model';
import {ModalController} from '@ionic/angular';
import {ObservationsService} from '../../observations.service';
import {HelpsService} from '../../../shared/helps/helps.service';

interface Props {
  extension?: number;
  type?: number;
}

@Component({
  selector: 'app-oils',
  templateUrl: './oils.component.html',
  styleUrls: ['./oils.component.scss'],
})
export class OilsComponent implements OnInit {
  public _props: Props = {};

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService,
    public helpsService: HelpsService
  ) {
  }

  ngOnInit() {
    this._props.extension = this.obsService.newObservation.details.oils.extension.code;
    this._props.type = this.obsService.newObservation.details.oils.type.code;
  }

  async closeModal(save: boolean) {
    if (save) {
      this.obsService.newObservation.details.oils.checked = true;
      this.obsService.newObservation.details.oils.extension.code = this._props.extension;
      this.obsService.newObservation.details.oils.type.code = this._props.type;
    }

    await this.modalCtr.dismiss();
  }
}
