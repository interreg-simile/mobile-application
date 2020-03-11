import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";


@Component({
    selector     : 'app-help-modal',
    templateUrl  : './help-modal.component.html',
    styleUrls    : ['./help-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HelpModalComponent implements OnInit {

    public _id: string;
    public _text: string;
    public imgSrc: string;


    constructor(private modalCtr: ModalController,
                private navParams: NavParams,
                private i18n: TranslateService,
                private photoViewer: PhotoViewer) { }


    ngOnInit(): void {

        this._id = this.navParams.get("id");

        if (!this._id) this.closeModal();

        this._text = this.i18n.instant(`helps.${ this._id }.text`);

    }


    /**
     * Fired when the user click on the photo. It opens the photo in a viewer.
     *
     * @param {string} src - The source of the image.
     */
    onImgClick(src: string): void {

        this.photoViewer.show(
            src,
            "",
            {
                share      : false,
                closeButton: true
            }
        );

    }


    /** Closes the modal. */
    async closeModal(): Promise<void> {

        await this.modalCtr.dismiss();

    }

}
