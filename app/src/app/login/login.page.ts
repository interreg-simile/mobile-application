import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from "@ionic/angular";
import { RegistrationModalComponent } from "./registration-modal/registration-modal.component";
import { Duration, ToastService } from "../shared/toast.service";
import { AuthService } from "../shared/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../shared/network.service";
import { projectEmail } from "../app.component"

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'] })
export class LoginPage implements OnInit {

  public email: string
  public password: string

  constructor(private modalCtr: ModalController,
              private toastService: ToastService,
              private authService: AuthService,
              private loadingCtr: LoadingController,
              private i18n: TranslateService,
              private networkService: NetworkService,
              private navController: NavController,
              private alertCtr: AlertController) { }

  ngOnInit() { }

  async onLoginClick(): Promise<void> {
    if (!this.networkService.checkOnlineContentAvailability()) return;

    const loading = await this.loadingCtr.create({
      message     : this.i18n.instant("common.wait"),
      showBackdrop: false
    });

    await loading.present();

    if (!this.email || !this.password) {
      await loading.dismiss();
      await this.toastService.presentToast("page-auth.missingCredentials", Duration.short)
      return
    }

    try {
      await this.authService.login(this.email, this.password)
    } catch (err) {
      await loading.dismiss();
      if (err.status === 401 || err.status === 404 || err.status === 422) {
        await this.toastService.presentToast("page-auth.invalidCredentials", Duration.short)
      } else if (err.status === 403) {
        await this.toastService.presentToast("page-auth.emailNotVerified", Duration.short)
      } else {
        await this.toastService.presentToast("common.errors.generic", Duration.short)
      }
      return
    }

    await loading.dismiss();
    await this.navController.navigateRoot('/map')
  }

  async onForgotPasswordClick(): Promise<void> {
    const alert = await this.alertCtr.create({
      message        : this.i18n.instant("page-auth.forgot-password-mg", { email: projectEmail }),
      buttons        : [
        { text: this.i18n.instant("common.alerts.btn-ok") }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  async onRegisterClick(): Promise<void> {
    const modal = await this.modalCtr.create({
      component      : RegistrationModalComponent,
      backdropDismiss: false,
    })
    await modal.present();
  }

  async onGuestClick(): Promise<void> {
    const loading = await this.loadingCtr.create({
      message     : this.i18n.instant("common.wait"),
      showBackdrop: false
    });

    await loading.present();

    try {
      await this.authService.signAsGuest()
    } catch (err) {
      await loading.dismiss();
      await this.toastService.presentToast("common.errors.generic", Duration.short)
      return
    }

    await loading.dismiss();
    await this.navController.navigateRoot('/map')
  }

}
