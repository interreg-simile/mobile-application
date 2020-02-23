import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";
import { CameraService, PicResult } from "../../../shared/camera.service";
import { Duration, ToastService } from "../../../shared/toast.service";
import { PhotoViewerComponent } from "../../../shared/photo-viewer/photo-viewer.component";


interface Props {
    inPlace?: boolean,
    terminal?: number,
    colour?: number,
    vapour?: boolean,
    signage?: boolean,
    signagePhoto?: string,
    prodActNearby?: boolean,
    prodActNearbyDetails?: string
}


@Component({
    selector   : 'app-outlets',
    templateUrl: './outlets.component.html',
    styleUrls  : ['./outlets.component.scss']
})
export class OutletsComponent implements OnInit {


    /** Settable properties. */
    private _props: Props = {};


    /** Selectable colours. */
    private _colours = {
        1: { selected: false, colour: "#D64818" },
        2: { selected: false, colour: "#1060B0" },
        3: { selected: false, colour: "#1F7F16" },
        4: { selected: false, colour: "#888888" },
        5: { selected: false, colour: "#6C4B11" },
        6: { selected: false, colour: "#D7B427" },
        7: { selected: false, colour: "#FFFFFF" }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    private _originalOrder = (a, b) => { return 0 };


    /** @ignore */
    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private cameraService: CameraService,
                private toastService: ToastService) { }


    /** @ignore */
    ngOnInit(): void {

        // Save the initial values of the settable properties
        this._props.inPlace              = this.obsService.newObservation.details.outlets.inPlace;
        this._props.terminal             = this.obsService.newObservation.details.outlets.terminal.code;
        this._props.colour               = this.obsService.newObservation.details.outlets.colour.code;
        this._props.vapour               = this.obsService.newObservation.details.outlets.vapour;
        this._props.signage              = this.obsService.newObservation.details.outlets.signage;
        this._props.signagePhoto         = this.obsService.newObservation.details.outlets.signagePhoto;
        this._props.prodActNearby        = this.obsService.newObservation.details.outlets.prodActNearby;
        this._props.prodActNearbyDetails = this.obsService.newObservation.details.outlets.prodActNearbyDetails;

        // Select the right colour
        if (this._props.colour) this._colours[this._props.colour].selected = true;

    }


    onHelpClick() { }


    /**
     * Handles a change in the selected colour.
     *
     * @param {Object} colour - The selected colour.
     */
    onColourClick(colour: any): void {

        // Set the property to undefined
        this._props.colour = undefined;

        // For each of the possible colours
        Object.keys(this._colours).forEach(c => {

            // If the colours has not been selected or if it was already selected
            if (c !== colour.key || (c === colour.key && this._colours[colour.key].selected)) {

                // Deselect the colour
                this._colours[c].selected = false;

                // Return
                return;

            }

            // Select the colour
            this._colours[c].selected = true;

            // Set the property value
            this._props.colour = colour.key;

        });

    }


    /**
     * Fired when the user click on the signage photo button.
     */
    async onSignagePhotoClick(): Promise<void> {

        if (this._props.signagePhoto) {

            const src = this.cameraService.getImgSrc(this._props.signagePhoto);

            // Open the image views model
            const modal = await this.modalCtr.create({
                component     : PhotoViewerComponent,
                componentProps: { src: src, edit: true, delete: true }
            });

            // Show the modal
            await modal.present();


            // Get the data passed by the modal dismiss
            const data = await modal.onDidDismiss();

            console.log(data);

            return;

        }


        // Take a picture
        const pic = await this.cameraService.takePicture();

        // If no image has been chosen, return
        if (pic === PicResult.NO_IMAGE) return;

        // If there is an error, alter the user
        if (pic === PicResult.ERROR) await this.toastService.presentToast("common.errors.photo", Duration.short);

        // Else, save the photo
        else this._props.signagePhoto = pic;

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {boolean} save - True if the modifications done in the modal are to be saved.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(save: boolean): Promise<void> {

        // If the modifications are to be saved
        if (save) {

            // Set the detail as checked
            this.obsService.newObservation.details.outlets.checked = true;

            // Save the new values
            this.obsService.newObservation.details.outlets.inPlace       = this._props.inPlace;
            this.obsService.newObservation.details.outlets.terminal.code = this._props.terminal;

            this.obsService.newObservation.details.outlets.colour.code =
                this._props.inPlace ? this._props.colour : undefined;


            this.obsService.newObservation.details.outlets.vapour = this._props.vapour;

            this.obsService.newObservation.details.outlets.signage      = this._props.signage;
            this.obsService.newObservation.details.outlets.signagePhoto =
                this._props.signage ? this._props.signagePhoto : undefined;

            this.obsService.newObservation.details.outlets.prodActNearby        = this._props.prodActNearby;
            this.obsService.newObservation.details.outlets.prodActNearbyDetails =
                this._props.prodActNearby ? this._props.prodActNearbyDetails.trim() : undefined;

        }

        // ToDo remove
        console.log(this._props);
        console.log(this.obsService.newObservation);

        // Close the modal
        await this.modalCtr.dismiss();

    }


}
