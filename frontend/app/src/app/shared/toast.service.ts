import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";


export enum Duration {
    short = 2000,
    long  = 3500
}


/** Service to present toast messages. */
@Injectable({ providedIn: 'root' })
export class ToastService {

    /** @ignore */
    constructor(private toastCtr: ToastController, private i18n: TranslateService) { }


    async presentToast(msg: string, duration: Duration) {

        const toast = await this.toastCtr.create({
            message : this.i18n.instant(msg),
            duration: duration
        });

        await toast.present();

    }

}
