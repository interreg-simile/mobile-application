import {Component, OnInit} from '@angular/core';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {NGXLogger} from 'ngx-logger';

import {LangService} from '../shared/lang.service';
import {projectEmail} from '../app.component';
import {AuthService} from '../shared/auth.service';
import {ChangeEmailComponent} from './change-email/change-email.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ChangeInfoComponent} from './change-info/change-info.component';
import {User, UserService} from '../shared/user.service';
import {NetworkService} from '../shared/network.service';
import {Duration, ToastService} from '../shared/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public _version: string;

  constructor(
    private appVersion: AppVersion,
    public langService: LangService,
    private alertController: AlertController,
    private i18n: TranslateService,
    private logger: NGXLogger,
    public authService: AuthService,
    private modalCtr: ModalController,
    private networkService: NetworkService,
    private loadingCtr: LoadingController,
    private userService: UserService,
    private toastService: ToastService,
    private alertCtr: AlertController,
    private navController: NavController
  ) {
  }

  ngOnInit() {
    this.getAppVersion().catch((err) =>
      this.logger.error('Error retrieving the app version', err)
    );
  }

  async onLangClick(): Promise<void> {
    const createInput = (): Array<any> => {
      const input = [];

      this.langService.supportedLanguages.forEach((lang) => {
        input.push({
          name: lang,
          type: 'radio',
          label: this.i18n.instant(`page-settings.general.language.${lang}`),
          value: lang,
          checked: lang === this.langService.currLanguage,
        });
      });

      return input;
    };

    const alert = await this.alertController.create({
      header: this.i18n.instant('page-settings.general.language.header'),
      backdropDismiss: false,
      inputs: createInput(),
      buttons: [
        {text: this.i18n.instant('common.alerts.btn-cancel'), role: 'cancel'},
        {
          text: this.i18n.instant('common.alerts.btn-ok'),
          handler: (data) => {
            if (data !== this.langService.currLanguage) {
              this.langService.useLanguage(data);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async onRegisterClick(): Promise<void> {
    await this.authService.logout();
    await this.navController.navigateRoot('/login');
  }

  async onChangeEmailClick(): Promise<void> {
    if (!this.networkService.checkOnlineContentAvailability()) {
      return;
    }

    const loading = await this.loadingCtr.create({
      message: this.i18n.instant('common.wait'),
      showBackdrop: false,
    });

    await loading.present();

    let user: User;
    try {
      user = await this.userService.getUser();
    } catch (err) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'common.errors.generic',
        Duration.short
      );
      return;
    }

    const modal = await this.modalCtr.create({
      component: ChangeEmailComponent,
      backdropDismiss: false,
      componentProps: user,
    });

    await loading.dismiss();
    await modal.present();
  }

  async onChangePasswordClick(): Promise<void> {
    if (!this.networkService.checkOnlineContentAvailability()) {
      return;
    }

    const modal = await this.modalCtr.create({
      component: ChangePasswordComponent,
      backdropDismiss: false,
    });
    await modal.present();
  }

  async onChangeInfoClick(): Promise<void> {
    if (!this.networkService.checkOnlineContentAvailability()) {
      return;
    }

    const loading = await this.loadingCtr.create({
      message: this.i18n.instant('common.wait'),
      showBackdrop: false,
    });

    await loading.present();

    let user: User;
    try {
      user = await this.userService.getUser();
    } catch (err) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'common.errors.generic',
        Duration.short
      );
      return;
    }

    const modal = await this.modalCtr.create({
      component: ChangeInfoComponent,
      backdropDismiss: false,
      componentProps: user,
    });

    await loading.dismiss();
    await modal.present();
  }

  async onLogoutClick(): Promise<void> {
    const alert = await this.alertCtr.create({
      header: this.i18n.instant('page-settings.account.logout.head'),
      message: this.i18n.instant('page-settings.account.logout.msg'),
      buttons: [
        {
          text: this.i18n.instant('page-settings.account.logout.btn-cancel'),
          role: 'cancel',
        },
        {
          text: this.i18n.instant('page-settings.account.logout.btn-confirm'),
          role: 'continue',
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();

    const choice = (await alert.onDidDismiss()).role;

    if (choice === 'cancel') {
      return;
    }

    await this.authService.logout();
    await this.navController.navigateRoot('/login');
  }

  async onDeleteClick(): Promise<void> {
    const alert = await this.alertCtr.create({
      header: this.i18n.instant('page-settings.account.delete.head'),
      message: this.i18n.instant('page-settings.account.delete.msg'),
      buttons: [
        {
          text: this.i18n.instant('page-settings.account.delete.btn-cancel'),
          role: 'cancel',
        },
        {
          text: this.i18n.instant('page-settings.account.delete.btn-delete'),
          role: 'continue',
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();

    const choice = (await alert.onDidDismiss()).role;

    if (choice === 'cancel') {
      return;
    }

    const loading = await this.loadingCtr.create({
      message: this.i18n.instant('common.wait'),
      showBackdrop: false,
    });
    await loading.present();

    try {
      await this.userService.deleteUser();
      await this.authService.logout();
      await loading.dismiss();
      await this.navController.navigateRoot('/login');
    } catch (error) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'common.errors.generic',
        Duration.short
      );
    }
  }

  async getAppVersion(): Promise<void> {
    this._version = await this.appVersion.getVersionNumber();
  }

  onContactUsClick(): void {
    window.open(`mailto:${projectEmail}`, '_system');
  }
}
