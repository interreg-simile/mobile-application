import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { Algae } from "../../observation.model";
import { ObservationsService } from "../../observations.service";


@Component({ selector: 'app-algae', templateUrl: './algae.component.html', styleUrls: ['./algae.component.scss'] })
export class AlgaeComponent implements OnInit {

    private _data: Algae;

    private _props = {
        extension : undefined,
        colour    : undefined,
        iridescent: undefined,
        look      : undefined
    };


    private _colours = {
        1: { selected: false, colour: "#D64818" },
        2: { selected: false, colour: "#1060B0" },
        3: { selected: false, colour: "#1F7F16" },
        4: { selected: false, colour: "#888888" },
        5: { selected: false, colour: "#6C4B11" }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


    ngOnInit() {

        this._data = this.obsService.newObservation.details.algae;

        console.log(this._data);

    }


    onHelpClick() {

        // console.log(this._colours)

        // console.log(this.obsService.newObservation)

        console.log(this._data);

    }


    async closeModal(save: boolean) {

        console.log(this._props);

        if (save) {

            this._data.checked = true;

            if (this._props.extension) this._data.extension = { dCode: { code: this._props.extension } };

        }


        await this.modalCtr.dismiss();

    }


    onPropChange(e, prop: string) { this._props[prop] = e.detail.value }


    onColourClick(colour) {

        Object.keys(this._colours).forEach(c => {

            this._colours[c].selected = c === colour.key && !this._colours[colour.key].selected

        });

    }


}
