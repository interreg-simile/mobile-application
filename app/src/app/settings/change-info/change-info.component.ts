import {Component, Input, OnInit} from '@angular/core';
import {User, UserService} from '../../shared/user.service';
import {Duration, ToastService} from '../../shared/toast.service';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-info',
  templateUrl: './change-info.component.html',
  styleUrls: ['./change-info.component.scss'],
})
export class ChangeInfoComponent implements OnInit {
  @Input() user: User;
  public name: string;
  public surname: string;
  public city: string;
  public yearOfBirth: number;

  public gender: string;
  public shownGender: string;
  private _genderMap = {
    male: this.i18n.instant('page-auth.modalRegister.male'),
    female: this.i18n.instant('page-auth.modalRegister.female'),
    other: this.i18n.instant('page-auth.modalRegister.other'),
  };

  constructor(
    private modalCtr: ModalController,
    private i18n: TranslateService,
    private loadingCtr: LoadingController,
    private toastService: ToastService,
    private userService: UserService,
    private alertCrt: AlertController
  ) {
  }

  ngOnInit() {
    this.shownGender = this._genderMap[this.gender];
  }

  async openGenderPicker(): Promise<void> {
    const alert = await this.alertCrt.create({
      header: this.i18n.instant('page-auth.modalRegister.phGender'),
      inputs: [
        {
          name: 'radio-gender',
          type: 'radio',
          label: '-',
          value: undefined,
          checked: !this.gender,
        },
        {
          name: 'radio-gender',
          type: 'radio',
          label: this._genderMap.male,
          value: 'male',
          checked: this.gender === 'male',
        },
        {
          name: 'radio-gender',
          type: 'radio',
          label: this._genderMap.female,
          value: 'female',
          checked: this.gender === 'female',
        },
        {
          name: 'radio-gender',
          type: 'radio',
          label: this._genderMap.other,
          value: 'other',
          checked: this.gender === 'other',
        },
      ],
      buttons: [
        {text: this.i18n.instant('common.alerts.btn-cancel'), role: 'cancel'},
        {
          text: this.i18n.instant('common.alerts.btn-confirm'),
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

  async onConfirmClick(): Promise<void> {
    const loading = await this.loadingCtr.create({
      message: this.i18n.instant('common.wait'),
      showBackdrop: false,
    });

    await loading.present();

    if (!this.name || !this.surname) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'page-settings.account.changeInfo.missingInfo',
        Duration.short
      );
      return;
    }

    try {
      await this.userService.changeInfo(
        this.name,
        this.surname,
        this.city,
        this.yearOfBirth,
        this.gender
      );
    } catch (error) {
      await loading.dismiss();
      if (error.status === 422) {
        await this.toastService.presentToast(
          'page-auth.modalRegister.invalidInfo',
          Duration.short
        );
      } else {
        await this.toastService.presentToast(
          'common.errors.generic',
          Duration.short
        );
      }
      return;
    }

    await loading.dismiss();
    await this.toastService.presentToast(
      'page-settings.account.updateSuccess',
      Duration.short
    );
    await this.closeModal();
  }

  async closeModal(): Promise<void> {
    await this.modalCtr.dismiss();
  }
}
