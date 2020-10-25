import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

export enum Duration {
  short = 2000,
  long = 3500,
}

@Injectable({providedIn: 'root'})
export class ToastService {
  constructor(
    private toastCtr: ToastController,
    private i18n: TranslateService
  ) {
  }

  async presentToast(msg: string, duration: Duration): Promise<void> {
    const toast = await this.toastCtr.create({
      message: this.i18n.instant(msg),
      duration,
    });

    await toast.present();
  }
}
