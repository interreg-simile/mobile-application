import {Component} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Duration, ToastService} from '../../shared/toast.service';
import {UserService} from '../../shared/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  public oldPassword: string;
  public password: string;
  public confirmPassword: string;

  constructor(
    private modalCtr: ModalController,
    private i18n: TranslateService,
    private loadingCtr: LoadingController,
    private toastService: ToastService,
    private userService: UserService
  ) {
  }

  async onConfirmClick(): Promise<void> {
    const loading = await this.loadingCtr.create({
      message: this.i18n.instant('common.wait'),
      showBackdrop: false,
    });

    await loading.present();

    if (!this.password || !this.confirmPassword) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'page-settings.account.changePassword.missingInfo',
        Duration.short
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'page-auth.modalRegister.passwordMismatch',
        Duration.short
      );
      return;
    }

    try {
      await this.userService.changePassword(
        this.oldPassword,
        this.password,
        this.confirmPassword
      );
    } catch (error) {
      await loading.dismiss();
      if (error.status === 422 || error.status === 401) {
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
    await this.closeModal();
    await this.toastService.presentToast(
      'page-settings.account.updateSuccess',
      Duration.short
    );
  }

  async closeModal(): Promise<void> {
    await this.modalCtr.dismiss();
  }
}
