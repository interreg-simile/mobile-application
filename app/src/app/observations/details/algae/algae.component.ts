import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ObservationsService} from '../../observations.service';
import {HelpsService} from '../../../shared/helps/helps.service';

interface Props {
  extension?: number;
  colour?: number;
  iridescent?: boolean;
  look?: number;
}

@Component({
  selector: 'app-algae',
  templateUrl: './algae.component.html',
  styleUrls: ['./algae.component.scss'],
})
export class AlgaeComponent implements OnInit {
  public _props: Props = {};

  public _colours = {
    1: {selected: false, colour: '#D64818'},
    2: {selected: false, colour: '#1060B0'},
    3: {selected: false, colour: '#1F7F16'},
    4: {selected: false, colour: '#888888'},
    5: {selected: false, colour: '#6C4B11'},
  };

  originalOrder = (a, b) => 0;

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService,
    public helpsService: HelpsService
  ) {
  }

  ngOnInit(): void {
    this._props.extension = this.obsService.newObservation.details.algae.extension.code;
    this._props.colour = this.obsService.newObservation.details.algae.colour.code;
    this._props.iridescent = this.obsService.newObservation.details.algae.iridescent;
    this._props.look = this.obsService.newObservation.details.algae.look.code;

    if (this._props.colour) {
      this._colours[this._props.colour].selected = true;
    }
  }

  async closeModal(save: boolean): Promise<void> {
    if (save) {
      this.obsService.newObservation.details.algae.checked = true;
      this.obsService.newObservation.details.algae.extension.code = this._props.extension;
      this.obsService.newObservation.details.algae.colour.code = this._props.colour;
      this.obsService.newObservation.details.algae.iridescent = this._props.iridescent;
      this.obsService.newObservation.details.algae.look.code = this._props.look;
    }

    console.log(this.obsService.newObservation);

    await this.modalCtr.dismiss();
  }

  onColourClick(colour): void {
    this._props.colour = undefined;

    Object.keys(this._colours).forEach((c) => {
      if (
        c !== colour.key ||
        (c === colour.key && this._colours[colour.key].selected)
      ) {
        this._colours[c].selected = false;
        return;
      }

      this._colours[c].selected = true;
      this._props.colour = parseInt(colour.key);
    });
  }
}
