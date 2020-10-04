import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Duration, ToastService } from "../../shared/toast.service";
import { AuthService } from "../../shared/auth.service";
import { NetworkService } from "../../shared/network.service";

@Component({
    selector   : 'app-registration-modal',
    templateUrl: './registration-modal.component.html',
    styleUrls  : ['./registration-modal.component.scss'],
})
export class RegistrationModalComponent implements OnInit {

    public email: string;
    public password: string;
    public confirmPassword: string;
    public name: string;
    public surname: string;
    public city: string;
    public year: number;
    public gender: string;
    public shownGender: string;

    constructor(private modalCtr: ModalController,
                private pickerCtr: PickerController,
                private i18n: TranslateService,
                private loadingCtr: LoadingController,
                private toastService: ToastService,
                private authService: AuthService,
                private networkService: NetworkService) { }

    ngOnInit() {}

    async openYearPicker(): Promise<void> {
        const colOptions = []
        let currYear     = new Date().getFullYear()
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
                        this.gender      = val["col"].value
                        this.shownGender = val["col"].text
                    }
                }
            ]
        })

        await picker.present();
    }

    async onRegisterClick(): Promise<void> {
        if (!this.networkService.checkOnlineContentAvailability()) return;

        const loading = await this.loadingCtr.create({
            message     : this.i18n.instant("common.wait"),
            showBackdrop: false
        });

        await loading.present();

        if (!this.email || !this.password || !this.confirmPassword || !this.name || !this.surname) {
            await loading.dismiss();
            await this.toastService.presentToast("page-auth.modalRegister.missingInfo", Duration.short)
            return
        }

        if (this.password !== this.confirmPassword) {
            await loading.dismiss();
            await this.toastService.presentToast("page-auth.modalRegister.passwordMismatch", Duration.short)
            return
        }

        try {
            await this.authService.register(this.email, this.password, this.confirmPassword, this.city, this.name,
                this.surname, this.year, this.gender)
        } catch (err) {
            await loading.dismiss();
            if (err.status === 500) {
                await this.toastService.presentToast("common.errors.generic", Duration.short)
            } else if (err.status === 409) {
                await this.toastService.presentToast("page-auth.modalRegister.emailInUse", Duration.short)
            } else {
                await this.toastService.presentToast("page-auth.modalRegister.invalidInfo", Duration.short)
            }
            return
        }

        await loading.dismiss();
        await this.toastService.presentToast("page-auth.modalRegister.success", Duration.short)
        await this.closeModal()
    }

    async closeModal(): Promise<void> {
        await this.modalCtr.dismiss();
    }

}
