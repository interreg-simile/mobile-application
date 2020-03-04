import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    extension?: number,
    look?: number,
    height?: number
}


@Component({ selector: 'app-foams', templateUrl: './foams.component.html', styleUrls: ['./foams.component.scss'] })
export class FoamsComponent implements OnInit {

    public _props: Props = {};


    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    ngOnInit() {

        this._props.extension = this.obsService.newObservation.details.foams.extension.code;
        this._props.look      = this.obsService.newObservation.details.foams.look.code;
        this._props.height    = this.obsService.newObservation.details.foams.height.code;

    }


    // ToDo implement help
    onHelpClick() { }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {Boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean) {

        if (save) {

            this.obsService.newObservation.details.foams.checked = true;
            this.obsService.newObservation.details.foams.extension.code = this._props.extension;
            this.obsService.newObservation.details.foams.look.code      = this._props.look;
            this.obsService.newObservation.details.foams.height.code    = this._props.height;

        }

        await this.modalCtr.dismiss();

    }

}
