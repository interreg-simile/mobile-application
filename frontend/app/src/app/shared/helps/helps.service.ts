import { Injectable } from '@angular/core';
import { ModalController, PopoverController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { HelpPopoverComponent } from "./help-popover/help-popover.component";
import { HelpModalComponent } from "./help-modal/help-modal.component";


@Injectable({ providedIn: 'root' })
export class HelpsService {

    constructor(private popoverCtr: PopoverController,
                private modalCtr: ModalController,
                private i18n: TranslateService) { }


    /**
     * Opes a popover that displays the help text related to the clicked element.
     *
     * @param {MouseEvent} e - The click event.
     * @param {string} helpId - The id of the help text.
     */
    async openHelpPopover(e: MouseEvent, helpId: string): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        const popover = await this.popoverCtr.create({
            component     : HelpPopoverComponent,
            componentProps: { text: this.resolveHelpText(helpId) },
            event         : e,
            showBackdrop  : false
        });

        await popover.present();

    }


    /**
     * Opes a modal that displays the help text related to the clicked element.
     *
     * @param {string} helpId - The id of the help text.
     * @param {boolean} [hasImage=true] - True if the modal has to display an image.
     */
    async openHelpModal(helpId: string, hasImage: boolean = true): Promise<void> {

        const modal = await this.modalCtr.create({
            component     : HelpModalComponent,
            componentProps: { id: helpId, hasImage: hasImage }
        });

        await modal.present();

    }


    /**
     * Fetches the right help text from the text id.
     *
     * @param {string} textId - The text id.
     * @return {string} The text.
     */
    private resolveHelpText(textId: string): string {

        return this.i18n.instant(`helps.${ textId }`);

    }

}
