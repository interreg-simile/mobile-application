import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

import {ObservationsService} from '../../observations.service';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
})
export class HubComponent implements OnInit {
  public _measures;

  originalOrder = (a, b) => 0;

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService
  ) {
  }

  ngOnInit(): void {
    this._measures = this.obsService.newObservation.measures;
  }

  async onMeasureCheckboxClick(e: MouseEvent, measure: any): Promise<void> {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.cancelBubble = true;
    e.stopPropagation();

    if (!measure.checked) {
      await this.openMeasureModal(measure.component);
    } else {
      measure.checked = false;
    }
  }

  async onMeasureLabelClick(e: MouseEvent, component: any): Promise<void> {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.cancelBubble = true;
    e.stopPropagation();

    await this.openMeasureModal(component);
  }

  async openMeasureModal(component: any): Promise<void> {
    const modal = await this.modalCtr.create({component});

    await modal.present();
  }

  async closeModal(): Promise<void> {
    this._measures.checked = Object.keys(this._measures).some(
      (k) => k !== 'checked' && this._measures[k].checked
    );

    await this.modalCtr.dismiss();
  }
}
