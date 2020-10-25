import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {ObservationsService} from '../../observations.service';
import {HelpsService} from '../../../shared/helps/helps.service';

@Component({
  selector: 'app-fauna',
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.scss'],
})
export class FaunaComponent implements OnInit {
  public _props: any = {
    fish: {alien: {species: [], idx: [1]}},
    birds: {alien: {species: [], idx: [1, 2]}},
    molluscs: {alien: {species: [], idx: [1, 2, 3]}},
    crustaceans: {alien: {species: [], idx: [1, 2, 3]}},
    turtles: {alien: {species: [], idx: [1]}},
  };

  public _originalOrder = (a, b) => 0;

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService,
    public helpsService: HelpsService
  ) {
  }

  ngOnInit(): void {
    Object.keys(this._props).forEach((k) => this.initProp(k));
  }

  initProp(key: string): void {
    const newObsFauna = this.obsService.newObservation.details.fauna;

    this._props[key].checked = newObsFauna[key].checked;
    this._props[key].number = newObsFauna[key].number;

    this._props[key].deceased = newObsFauna[key].deceased;

    this._props[key].abnormal = {
      checked: newObsFauna[key].abnormal.checked,
      details: newObsFauna[key].abnormal.details,
    };

    this._props[key].alien.checked = newObsFauna[key].alien.checked;
    newObsFauna[key].alien.species.forEach((t) =>
      this._props[key].alien.species.push(t.code)
    );
  }

  onSpecieChange(e: CustomEvent, key: string): void {
    if (e.detail.checked) {
      this._props[key].alien.species.push(parseInt(e.detail.value));
    } else {
      this._props[key].alien.species = this._props[key].alien.species.filter(
        (t) => t !== parseInt(e.detail.value)
      );
    }
  }

  async closeModal(save: boolean): Promise<void> {
    if (save) {
      const newObsFauna = this.obsService.newObservation.details.fauna;

      this.obsService.newObservation.details.fauna.checked = true;

      Object.keys(this._props).forEach((k) => {
        if (!this._props[k].checked) {
          newObsFauna[k].checked = undefined;
          newObsFauna[k].number = undefined;
          newObsFauna[k].deceased = undefined;
          this.resetObsAbnormal(k);
          this.resetObsAlien(k);

          return;
        }

        newObsFauna[k].checked = true;
        newObsFauna[k].number = this._props[k].number
          ? Math.abs(this._props[k].number)
          : undefined;

        if (this._props[k].deceased) {
          newObsFauna[k].deceased = true;
        } else {
          newObsFauna[k].deceased = undefined;
        }

        if (this._props[k].abnormal.checked) {
          newObsFauna[k].abnormal.checked = true;
          newObsFauna[k].abnormal.details = this._props[k].abnormal.details;
        } else {
          this.resetObsAbnormal(k);
        }

        if (this._props[k].alien.checked) {
          newObsFauna[k].alien.checked = true;
          newObsFauna[k].alien.species = [];
          this._props[k].alien.species.forEach((t) =>
            newObsFauna[k].alien.species.push({code: t})
          );
        } else {
          this.resetObsAlien(k);
        }
      });
    }

    await this.modalCtr.dismiss();
  }

  resetObsAbnormal(propKey: string) {
    const newObsFauna = this.obsService.newObservation.details.fauna;

    newObsFauna[propKey].abnormal = {checked: undefined, details: undefined};
  }

  resetObsAlien(propKey: string) {
    const newObsFauna = this.obsService.newObservation.details.fauna;

    newObsFauna[propKey].alien = {checked: undefined, species: []};
  }
}
