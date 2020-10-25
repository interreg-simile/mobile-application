import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ObservationsService} from '../../observations.service';

interface Props {
  quantity?: number;
  type?: number[];
}

@Component({
  selector: 'app-litters',
  templateUrl: './litters.component.html',
  styleUrls: ['./litters.component.scss'],
})
export class LittersComponent implements OnInit {
  public _props: Props = {};

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService
  ) {
  }

  ngOnInit() {
    this._props.quantity = this.obsService.newObservation.details.litters.quantity.code;
    this._props.type = [];
    this.obsService.newObservation.details.litters.type.forEach((t) =>
      this._props.type.push(t.code)
    );
  }

  onTypeChange(e) {
    if (e.detail.checked) {
      this._props.type.push(parseInt(e.detail.value));
    } else {
      this._props.type = this._props.type.filter(
        (t) => t !== parseInt(e.detail.value)
      );
    }
  }

  async closeModal(save: boolean) {
    if (save) {
      this.obsService.newObservation.details.litters.checked = true;
      this.obsService.newObservation.details.litters.quantity.code = this._props.quantity;
      this.obsService.newObservation.details.litters.type = [];
      this._props.type.forEach((t) =>
        this.obsService.newObservation.details.litters.type.push({code: t})
      );
    }

    await this.modalCtr.dismiss();
  }
}
