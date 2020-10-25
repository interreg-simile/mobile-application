import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpPopoverComponent implements OnInit {
  public _text: string;

  constructor(
    private navParams: NavParams,
    private popoverCrt: PopoverController
  ) {
  }

  ngOnInit(): void {
    this._text = this.navParams.get('text');

    if (!this._text) {
      this.popoverCrt.dismiss();
    }
  }
}
