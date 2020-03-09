import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { ObservationsService } from "../../observations.service";


interface Props {
    fish?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number> }
    },
    birds?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number> }
    },
    molluscs?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number> }
    },
    crustaceans?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number> }
    },
    turtles?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number> }
    }
}


@Component({ selector: 'app-fauna', templateUrl: './fauna.component.html', styleUrls: ['./fauna.component.scss'] })
export class FaunaComponent implements OnInit {


    public _props: Props = { fish: {}, birds: {}, molluscs: {}, crustaceans: {}, turtles: {} };

    public _objKeys = Object.keys;

    // Utility function to keep the original key order when iterating on an object using ngFor
    public _originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController, private obsService: ObservationsService) { }


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

        this._props[key].deceased = {
            checked: newObsFauna[key].deceased.checked,
            number : newObsFauna[key].deceased.number
        };

        this._props[key].abnormal = {
            checked: newObsFauna[key].abnormal.checked,
            details : newObsFauna[key].abnormal.details
        };

        this._props[key].alien = { checked: newObsFauna[key].alien.checked, species: [] };
        newObsFauna[key].alien.species.forEach(t => this._props[key].species.push(t.code));

    }


    // ToDo implement help click
    onHelpClick(): void { console.log(this._props) }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        await this.modalCtr.dismiss();

    }


}
