import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { ObservationsService } from "../../observations.service";
import { Duration, ToastService } from "../../../shared/toast.service";


interface Props {
    fish?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, max: number }
    },
    birds?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, max: number }
    },
    molluscs?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, max: number }
    },
    crustaceans?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, max: number }
    },
    turtles?: {
        checked?: boolean,
        deceased?: { checked?: boolean, number?: number },
        abnormal?: { checked?: boolean, details?: string },
        alien?: { checked?: boolean, species?: Array<number>, max: number }
    }
}


@Component({ selector: 'app-fauna', templateUrl: './fauna.component.html', styleUrls: ['./fauna.component.scss'] })
export class FaunaComponent implements OnInit {

    public _props: Props = {
        fish       : { alien: { species: [], max: 1 } },
        birds      : { alien: { species: [], max: 2 } },
        molluscs   : { alien: { species: [], max: 3 } },
        crustaceans: { alien: { species: [], max: 3 } },
        turtles    : { alien: { species: [], max: 1 } }
    };


    // Utility function to keep the original key order when iterating on an object using ngFor
    public _originalOrder = (a, b) => { return 0 };


    constructor(private modalCtr: ModalController,
                private obsService: ObservationsService,
                private alertCtr: AlertController,
                private i18n: TranslateService,
                private toastService: ToastService,
                private changeRef: ChangeDetectorRef) { }


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
            details: newObsFauna[key].abnormal.details
        };

        this._props[key].alien.checked = newObsFauna[key].alien.checked;
        newObsFauna[key].alien.species.forEach(t => this._props[key].species.push(t.code));

    }


    /**
     * Fired when the user clicks to enter the number of deceased animals.
     *
     * @param {MouseEvent} e - The click event.
     * @param {string} propKey - The name of the animal category.
     */
    async onDeceasedNumberClick(e: MouseEvent, propKey: string): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        const alert = await this.alertCtr.create({
            subHeader      : this.i18n.instant("page-new-obs.details.fauna.deceased.number-header"),
            backdropDismiss: false,
            inputs         : [
                {
                    name       : "data",
                    type       : "number",
                    value      : this._props[propKey].deceased.number,
                    min        : 0,
                    placeholder: this.i18n.instant("page-new-obs.details.fauna.deceased.number-ph")
                }
            ],
            buttons        : [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => {

                        const val = parseInt(data.data);

                        if (Number.isNaN(val)) {
                            this._props[propKey].deceased.number = undefined;
                            this.changeRef.detectChanges();
                            return true;
                        }

                        if (val < 0) {
                            this.toastService.presentToast("page-new-obs.details.fauna.deceased.err-positive-number", Duration.short);
                            return false;
                        }

                        this._props[propKey].deceased.number = val;
                        this.changeRef.detectChanges();

                    }
                }
            ]
        });

        await alert.present();

    }

    /**
     * Fired when the user clicks to enter the details about abnormal behaviours.
     *
     * @param {MouseEvent} e - The click event.
     * @param {string} propKey - The name of the animal category.
     */
    async onAbnormalDetailsClick(e: MouseEvent, propKey: string): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();

        const alert = await this.alertCtr.create({
            subHeader      : this.i18n.instant("page-new-obs.details.fauna.abnormal.details-header"),
            backdropDismiss: false,
            inputs         : [
                {
                    name       : "data",
                    type       : "text",
                    value      : this._props[propKey].abnormal.details,
                    placeholder: this.i18n.instant("page-new-obs.details.fauna.abnormal.details-ph")
                }
            ],
            buttons        : [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => {

                        const val = data.data;

                        if (!val || val === "")
                            this._props[propKey].abnormal.details = undefined;
                        else
                            this._props[propKey].abnormal.details = val;

                        this.changeRef.detectChanges();

                    }
                }
            ]
        });

        await alert.present();

    }

    /**
     * Fired when the user clicks to enter the alien species.
     *
     * @param {MouseEvent} e - The click event.
     * @param {string} propKey - The name of the animal category.
     */
    async onAlienSpeciesClick(e: MouseEvent, propKey: string): Promise<void> {

        e.preventDefault();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();


        const createInputs = () => {

            const inputs = [];

            for (let i = 1; i < this._props[propKey].alien.max + 1; i++) {

                inputs.push({
                    type : "checkbox",
                    value: i,
                    label: this.i18n.instant(`page-new-obs.details.fauna.alien.${ propKey }.${ i }`)
                });

            }

            return inputs;

        };


        const alert = await this.alertCtr.create({
            subHeader      : this.i18n.instant("page-new-obs.details.fauna.alien.species-header"),
            backdropDismiss: false,
            inputs         : createInputs(),
            buttons        : [
                { text: "help", handler: () => console.log("help clicked") },
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                {
                    text   : this.i18n.instant("common.alerts.btn-ok"),
                    handler: data => {

                        console.log(data);

                    }
                }
            ]
        });

        await alert.present();


    }


    /**
     * Closes the modal and handle the data saving process.
     *
     * @param {boolean} save - True if the modifications done in the modal are to be saved.
     */
    async closeModal(save: boolean): Promise<void> {

        await this.modalCtr.dismiss();

    }

}
