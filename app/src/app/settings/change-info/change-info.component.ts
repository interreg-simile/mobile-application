import { Component, Input, OnInit } from '@angular/core';
import { User, UserService } from "../../shared/user.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { LoadingController, ModalController, PickerController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.scss'],
})
export class ChangeInfoComponent implements OnInit {

  @Input() user: User
  public name: string
  public surname: string
  public city: string
  public yearOfBirth: string
  public gender: string
  public shownGender: string

  constructor(private modalCtr: ModalController,
              private i18n: TranslateService,
              private loadingCtr: LoadingController,
              private toastService: ToastService,
              private userService: UserService,
              private pickerCtr: PickerController) { }

  ngOnInit() {
    this.shownGender = this.i18n.instant(`page-auth.modalRegister.${this.gender}`)
  }

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
          handler: val => this.yearOfBirth = val["col"].value
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

  async onConfirmClick(): Promise<void> {
    const loading = await this.loadingCtr.create({
      message     : this.i18n.instant("common.wait"),
      showBackdrop: false
    });

    await loading.present();

    if (!this.name || !this.surname) {
      await loading.dismiss();
      await this.toastService.presentToast("page-settings.general.changeInfo.missingInfo", Duration.short)
      return
    }

    try {
      await this.userService.changeInfo(this.name, this.surname, this.city, parseInt(this.yearOfBirth), this.gender)
    } catch (error) {
      await loading.dismiss();
      if (error.status === 500) {
        await this.toastService.presentToast("common.errors.generic", Duration.short)
      } else {
        await this.toastService.presentToast("page-auth.modalRegister.invalidInfo", Duration.short)
      }
      return
    }

    await loading.dismiss();
    await this.toastService.presentToast("page-settings.general.updateSuccess", Duration.short)
    await this.closeModal()
  }

  async closeModal(): Promise<void> {
    await this.modalCtr.dismiss();
  }

}
