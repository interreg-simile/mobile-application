import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-call-authorities',
  templateUrl: './call-authorities.component.html',
  styleUrls: ['./call-authorities.component.scss'],
})
export class CallAuthoritiesComponent {
  @Input() area: number;
  @Input() callId: string;

  contacts = {
    1: '800.061.160',
    2: '',
  };

  constructor(private modalCtr: ModalController) {
  }

  async onClose() {
    await this.modalCtr.dismiss();
  }
}
