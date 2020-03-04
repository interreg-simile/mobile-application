import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    extension?: number,
    colour?: number,
    iridescent?: boolean,
    look?: number
}


@Component({ selector: 'app-algae', templateUrl: './algae.component.html', styleUrls: ['./algae.component.scss'] })
export class AlgaeComponent implements OnInit {

    public _props: Props = {};

    public _colours = {
        1: { selected: false, colour: "#D64818" },
        2: { selected: false, colour: "#1060B0" },
        3: { selected: false, colour: "#1F7F16" },
        4: { selected: false, colour: "#888888" },
        5: { selected: false, colour: "#6C4B11" }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    ngOnInit(): void {

        // Save the initial values of the settable properties
        this._props.extension  = this.obsService.newObservation.details.algae.extension.code;
        this._props.colour     = this.obsService.newObservation.details.algae.colour.code;
        this._props.iridescent = this.obsService.newObservation.details.algae.iridescent;
        this._props.look       = this.obsService.newObservation.details.algae.look.code;

        // Select the right colour
        if (this._props.colour) this._colours[this._props.colour].selected = true;

    }


    // ToDo implement help
    onHelpClick() { }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        if (save) {

            this.obsService.newObservation.details.algae.checked        = true;
            this.obsService.newObservation.details.algae.extension.code = this._props.extension;
            this.obsService.newObservation.details.algae.colour.code    = this._props.colour;
            this.obsService.newObservation.details.algae.iridescent     = this._props.iridescent;
            this.obsService.newObservation.details.algae.look.code      = this._props.look;

        }

        await this.modalCtr.dismiss();

    }


    /**
     * Handles a change in the selected colour.
     *
     * @param {Object} colour - The selected colour.
     */
    onColourClick(colour): void {

        this._props.colour = undefined;

        Object.keys(this._colours).forEach(c => {

            if (c !== colour.key || (c === colour.key && this._colours[colour.key].selected)) {
                this._colours[c].selected = false;
                return;
            }

            this._colours[c].selected = true;
            this._props.colour = colour.key;

        });

    }


}
