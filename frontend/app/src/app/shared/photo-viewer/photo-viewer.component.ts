import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { statusBarColor } from "../../app.component";


@Component({
    selector   : 'app-photo-viewer',
    templateUrl: './photo-viewer.component.html',
    styleUrls  : ['./photo-viewer.component.scss'],
})
export class PhotoViewerComponent implements OnInit {

    public src: String;
    public delete: Boolean;
    public edit: Boolean;


    constructor(private modalCtrl: ModalController, private statusBar: StatusBar) { }


    ngOnInit(): void { this.statusBar.backgroundColorByHexString("#000000") }


    /** Closes the modal. */
    async onCLoseClick(): Promise<void> { await this.dismiss() }


    /** Closes the modal after an edit command has been issued. */
    async onEditClick(): Promise<void> { await this.dismiss({ edit: true }) }


    /** Closes the modal after a delete command has been issued. */
    async onDeleteClick(): Promise<void> { await this.dismiss({ delete: true }) }


    /**
     * Dismisses the modal optionally passing some data.
     *
     * @param {Object} [data] - The data to pass.
     */
    async dismiss(data?): Promise<void> {

        this.statusBar.backgroundColorByHexString(statusBarColor);

        await this.modalCtrl.dismiss(data);

    }


}
