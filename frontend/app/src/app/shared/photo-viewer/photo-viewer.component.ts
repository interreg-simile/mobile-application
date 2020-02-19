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


    /** Source of the image to be displayed */
    public src: String;

    /** Flag that states if the image can be deleted. */
    public delete: Boolean;

    /** Flag that states if the image can be edited. */
    public edit: Boolean;


    /** @ignore */
    constructor(private modalCtrl: ModalController, private statusBar: StatusBar) { }


    /** @ignore */
    ngOnInit() {

        // Set bg of the status bar
        this.statusBar.backgroundColorByHexString("#000000");

    }


    /**
     * Closes the modal.
     *
     * @return {Promise<>} An empty promise.
     */
    async onCLoseClick() { await this.dismiss() }

    /**
     * Closes the modal after an edit command has been issued.
     *
     * @return {Promise<>} An empty promise.
     */
    async onEditClick() { await this.dismiss({ edit: true }) }

    /**
     * Closes the modal after a delete command has been issued.
     *
     * @return {Promise<>} An empty promise.
     */
    async onDeleteClick() { await this.dismiss({ delete: true }) }


    /**
     * Dismisses the modal optionally passing some data.
     *
     * @param {Object} [data] - The data to pass.
     * @return {Promise<>} - An empty promise.
     */
    async dismiss(data?) {

        // Set the status bar colour back to the main one
        this.statusBar.backgroundColorByHexString(statusBarColor);

        // Dismiss the modal
        await this.modalCtrl.dismiss(data);

    }


}
