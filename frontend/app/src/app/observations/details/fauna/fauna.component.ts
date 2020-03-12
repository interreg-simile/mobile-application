import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

import { ObservationsService } from "../../observations.service";
import { HelpsService } from "../../../shared/helps/helps.service";


interface Props {
    fish?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, idx: Array<number> }
    },
    birds?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, idx: Array<number> }
    },
    molluscs?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, idx: Array<number> }
    },
    crustaceans?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, idx: Array<number> }
    },
    turtles?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, idx: Array<number> }
    }
}


@Component({ selector: 'app-fauna', templateUrl: './fauna.component.html', styleUrls: ['./fauna.component.scss'] })
export class FaunaComponent implements OnInit {

    public _props: Props = {
        fish       : { alien: { species: [], idx: [1] } },
        birds      : { alien: { species: [], idx: [1, 2] } },
        molluscs   : { alien: { species: [], idx: [1, 2, 3] } },
        crustaceans: { alien: { species: [], idx: [1, 2, 3] } },
        turtles    : { alien: { species: [], idx: [1] } }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    public _originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private helpsService: HelpsService) { }


    ngOnInit(): void {

        Object.keys(this._props).forEach(k => this.initProp(k));

    }


    /**
     * Initialize a fauna property.
     *
     * @param {string} key - The name of the property.
     */
    initProp(key: string): void {

        const newObsFauna = this.obsService.newObservation.details.fauna;

        this._props[key].checked = newObsFauna[key].checked;

        this._props[key].deceased = {
            checked: newObsFauna[key].deceased.checked,
            number : newObsFauna[key].deceased.number
        };

        this._props[key].abnormal = {
            checked: newObsFauna[key].abnormal.checked,
            details: newObsFauna[key].abnormal.details
        };

        this._props[key].alien.checked = newObsFauna[key].alien.checked;
        newObsFauna[key].alien.species.forEach(t => this._props[key].alien.species.push(t.code));

    }


    /**
     * Fired when a change event is fired by the alien species checkbox group.
     *
     * @param {CustomEvent} e - The change event.
     * @param {string} key - The fauna category.
     */
    onSpecieChange(e: CustomEvent, key: string): void {

        if (e.detail.checked)
            this._props[key].alien.species.push(parseInt(e.detail.value));
        else
            this._props[key].alien.species = this._props[key].alien.species.filter(t => t !== parseInt(e.detail.value));

    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        console.log(this._props);

        if (save) {

            const newObsFauna = this.obsService.newObservation.details.fauna;

            this.obsService.newObservation.details.fauna.checked = true;

            Object.keys(this._props).forEach(k => {

                if (!this._props[k].checked) {

                    newObsFauna[k].checked = undefined;
                    this.resetObsDeceased(k);
                    this.resetObsAbnormal(k);
                    this.resetObsAlien(k);

                    return;

                }

                newObsFauna[k].checked = true;

                if (this._props[k].deceased.checked) {
                    newObsFauna[k].deceased.checked = true;
                    newObsFauna[k].deceased.number  = Math.abs(this._props[k].deceased.number);
                } else {
                    this.resetObsDeceased(k);
                }

                if (this._props[k].abnormal.checked) {
                    newObsFauna[k].abnormal.checked = true;
                    newObsFauna[k].abnormal.details = this._props[k].abnormal.details;
                } else {
                    this.resetObsAbnormal(k);
                }

                if (this._props[k].alien.checked) {
                    newObsFauna[k].alien.checked = true;
                    newObsFauna[k].alien.species = [];
                    this._props[k].alien.species.forEach(t => newObsFauna[k].alien.species.push({ code: t }));
                } else {
                    this.resetObsAlien(k);
                }

            });

            console.log(this.obsService.newObservation);

        }

        await this.modalCtr.dismiss();

    }


    /**
     * Resets the deceased property of a fauna category of the current new observation.
     *
     * @param {string} propKey - The name of the category
     */
    resetObsDeceased(propKey: string) {

        const newObsFauna = this.obsService.newObservation.details.fauna;

        newObsFauna[propKey].deceased = { checked: undefined, number: undefined }

    }

    /**
     * Resets the abnormal property of a fauna category of the current new observation.
     *
     * @param {string} propKey - The name of the category
     */
    resetObsAbnormal(propKey: string) {

        const newObsFauna = this.obsService.newObservation.details.fauna;

        newObsFauna[propKey].abnormal = { checked: undefined, details: undefined }

    }

    /**
     * Resets the alien property of a fauna category of the current new observation.
     *
     * @param {string} propKey - The name of the category
     */
    resetObsAlien(propKey: string) {

        const newObsFauna = this.obsService.newObservation.details.fauna;

        newObsFauna[propKey].alien = { checked: undefined, species: [] }

    }


}
