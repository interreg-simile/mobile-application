import {Component} from '@angular/core';
import {Events, NavParams, PopoverController} from '@ionic/angular';
import {AuthService} from '../../shared/auth.service';

export enum Markers {
  USER_OBSERVATIONS,
  OTHER_OBSERVATIONS,
  EVENTS,
}

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
})
export class LegendComponent {
  public _markerEnum = Markers;

  constructor(
    private popoverCtr: PopoverController,
    public navParams: NavParams,
    private events: Events,
    public authService: AuthService
  ) {
  }

  onCheckboxChange(e: CustomEvent, markerType: Markers) {
    this.events.publish('popover:change', {
      marker: markerType,
      checked: e.detail.checked,
    });
  }
}
