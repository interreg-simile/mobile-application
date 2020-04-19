import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector   : 'app-term-modal',
    templateUrl: './term-modal.component.html',
    styleUrls  : ['./term-modal.component.scss'],
})
export class TermModalComponent implements OnInit {

    public _id: string;
    public _title: string;


    constructor(private modalCtr: ModalController,
                private navParams: NavParams,
                private i18n: TranslateService) { }

    ngOnInit(): void {

        this._id    = this.navParams.get("id");

        if (!this._id) this.closeModal();

        this._title = this.i18n.instant(`page-glossary.${ this._id }.title`);

    }

    /** Closes the modal. */
    async closeModal(): Promise<void> {

        await this.modalCtr.dismiss();

    }

}
