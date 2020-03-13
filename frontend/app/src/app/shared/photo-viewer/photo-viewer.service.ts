import { Injectable } from '@angular/core';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ModalController } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { statusBarColor } from "../../app.component";


@Injectable({ providedIn: 'root' })
export class PhotoViewerService {

    constructor(private modalCrt: ModalController,
                private statusBar: StatusBar) { }


    /**
     * Opens a photo in a viewer with zooming capabilities.
     *
     * @param {string} src - The source of the image.
     */
    async openPhotoViewer(src: string) {

        const modal = await this.modalCrt.create({
            component     : ViewerModalComponent,
            componentProps: {
                src   : src,
                scheme: "dark"
            },
            cssClass      : "ion-img-viewer",
            keyboardClose : true,
            showBackdrop  : true
        });

        this.statusBar.backgroundColorByHexString("#000000");

        await modal.present();

        await modal.onWillDismiss();

        this.statusBar.backgroundColorByHexString(statusBarColor);

    }

}
