import {Component, Input} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Duration, ToastService} from '../../shared/toast.service';
import {User, UserService} from '../../shared/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent {
  @Input() user: User;
  public email: string;

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

    if (!this.email) {
      await loading.dismiss();
      await this.toastService.presentToast(
        'page-settings.account.changeEmail.missingEmail',
        Duration.short
      );
      return;
    }

    try {
      await this.userService.changeEmail(this.email);
    } catch (error) {
      await loading.dismiss();
      if (error.status === 422) {
        await this.toastService.presentToast(
          'page-auth.modalRegister.invalidInfo',
          Duration.short
        );
      } else if (error.status === 409) {
        await this.toastService.presentToast(
          'page-auth.modalRegister.emailInUse',
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
