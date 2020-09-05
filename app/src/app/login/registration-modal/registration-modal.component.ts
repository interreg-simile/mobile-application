import { Component, OnInit } from '@angular/core';
import { ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector   : 'app-registration-modal',
    templateUrl: './registration-modal.component.html',
    styleUrls  : ['./registration-modal.component.scss'],
})
export class RegistrationModalComponent implements OnInit {

    public year: number;

    public gender: string;
    public shownGender: string;

    constructor(private modalCtr: ModalController,
                private pickerCtr: PickerController,
                private i18n: TranslateService) { }

    ngOnInit() {}

    async openYearPicker(): Promise<void> {
        const colOptions = []
        let currYear = new Date().getFullYear()
        const startYear  = 1920
        while (currYear >= startYear) {
            colOptions.push({
                text : currYear,
                value: currYear
            })
            currYear--
        }

        const picker = await this.pickerCtr.create({
            columns: [{
                name   : "col",
                options: colOptions
            }],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                {
                    text   : this.i18n.instant("common.alerts.btn-confirm"),
                    handler: val => this.year = val["col"].value
                }
            ]
        })

        await picker.present();
    }

    async openGenderPicker(): Promise<void> {
        const colOptions = [
            { text: this.i18n.instant("page-auth.modalRegister.male"), value: "male" },
            { text: this.i18n.instant("page-auth.modalRegister.female"), value: "female" },
            { text: this.i18n.instant("page-auth.modalRegister.other"), value: "other" },
        ]

        const picker = await this.pickerCtr.create({
            columns: [{
                name   : "col",
                options: colOptions
            }],
            buttons: [
                { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
                {
                    text   : this.i18n.instant("common.alerts.btn-confirm"),
                    handler: val => {
                        this.gender = val["col"].value
                        this.shownGender = val["col"].text
                    }
                }
            ]
        })

        await picker.present();
    }

    async closeModal(): Promise<void> {

        await this.modalCtr.dismiss();

    }

}
