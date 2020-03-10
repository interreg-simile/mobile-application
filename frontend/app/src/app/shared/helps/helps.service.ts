import { Injectable } from '@angular/core';
import { PopoverController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { HelpPopoverComponent } from "./help-popover/help-popover.component";


export enum HelpsTypes {
    POPOVER,
    MODAL
}


@Injectable({ providedIn: 'root' })
export class HelpsService {

    public types = HelpsTypes;


    constructor(private popoverCtr: PopoverController,
                private i18n: TranslateService) { }


    async openHelpPopover(e: MouseEvent, textId: string): Promise<void> {

        const popover = await this.popoverCtr.create({
            component     : HelpPopoverComponent,
            componentProps: { text: this.resolveHelpText(textId) },
            event         : e,
            showBackdrop  : false
        });

        await popover.present();

    }


    private resolveHelpText(textId: string): string {

        return this.i18n.instant(`helps.${ textId }`);

    }

}
