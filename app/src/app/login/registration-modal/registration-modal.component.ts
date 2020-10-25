import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Duration, ToastService } from "../../shared/toast.service";
import { AuthService } from "../../shared/auth.service";
import { NetworkService } from "../../shared/network.service";

@Component({
  selector: "app-registration-modal",
  templateUrl: "./registration-modal.component.html",
  styleUrls: ["./registration-modal.component.scss"],
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
  private _genderMap = {
    male: this.i18n.instant("page-auth.modalRegister.male"),
    female: this.i18n.instant("page-auth.modalRegister.female"),
    other: this.i18n.instant("page-auth.modalRegister.other"),
  };

  constructor(
    private modalCtr: ModalController,
    public i18n: TranslateService,
    private loadingCtr: LoadingController,
    private toastService: ToastService,
    private authService: AuthService,
    private alertCrt: AlertController,
    private networkService: NetworkService,
    public platform: Platform
  ) {}

  ngOnInit() {}

  async openGenderPicker(): Promise<void> {
    const alert = await this.alertCrt.create({
      header: this.i18n.instant("page-auth.modalRegister.phGender"),
      inputs: [
        {
          name: "radio-gender",
          type: "radio",
          label: "-",
          value: undefined,
          checked: !this.gender,
        },
        {
          name: "radio-gender",
          type: "radio",
          label: this._genderMap.male,
          value: "male",
          checked: this.gender === "male",
        },
        {
          name: "radio-gender",
          type: "radio",
          label: this._genderMap.female,
          value: "female",
          checked: this.gender === "female",
        },
        {
          name: "radio-gender",
          type: "radio",
          label: this._genderMap.other,
          value: "other",
          checked: this.gender === "other",
        },
      ],
      buttons: [
        { text: this.i18n.instant("common.alerts.btn-cancel"), role: "cancel" },
        {
          text: this.i18n.instant("common.alerts.btn-confirm"),
          handler: (value) => {
            this.gender = value;
            this.shownGender = this._genderMap[value];
          },
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  async onRegisterClick(): Promise<void> {
    if (!this.networkService.checkOnlineContentAvailability()) return;

    const loading = await this.loadingCtr.create({
      message: this.i18n.instant("common.wait"),
      showBackdrop: false,
    });

    await loading.present();

    if (
      !this.email ||
      !this.password ||
      !this.confirmPassword ||
      !this.name ||
      !this.surname
    ) {
      await loading.dismiss();
      await this.toastService.presentToast(
        "page-auth.modalRegister.missingInfo",
        Duration.short
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      await loading.dismiss();
      await this.toastService.presentToast(
        "page-auth.modalRegister.passwordMismatch",
        Duration.short
      );
      return;
    }

    try {
      await this.authService.register(
        this.email,
        this.password,
        this.confirmPassword,
        this.name,
        this.surname,
        this.city,
        this.year,
        this.gender
      );
    } catch (err) {
      await loading.dismiss();
      if (err.status === 422) {
        await this.toastService.presentToast(
          "page-auth.modalRegister.invalidInfo",
          Duration.short
        );
      } else if (err.status === 409) {
        await this.toastService.presentToast(
          "page-auth.modalRegister.emailInUse",
          Duration.short
        );
      } else {
        await this.toastService.presentToast(
          "common.errors.generic",
          Duration.short
        );
      }
      return;
    }

    await loading.dismiss();
    await this.toastService.presentToast(
      "page-auth.modalRegister.success",
      Duration.short
    );
    await this.closeModal();
  }

  async closeModal(): Promise<void> {
    await this.modalCtr.dismiss();
  }
}
