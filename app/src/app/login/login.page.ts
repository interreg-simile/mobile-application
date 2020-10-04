import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from "@ionic/angular";
import { RegistrationModalComponent } from "./registration-modal/registration-modal.component";
import { Duration, ToastService } from "../shared/toast.service";
import { AuthService } from "../shared/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { NetworkService } from "../shared/network.service";

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'] })
export class LoginPage implements OnInit {

    public email: string
    public password: string

    constructor(private modalCtr: ModalController,
                private toastService: ToastService,
                private authService: AuthService,
                private loadingCtr: LoadingController,
                private i18n: TranslateService,
                private router: Router,
                private networkService: NetworkService) { }

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
            if (err.status === 500) {
                await this.toastService.presentToast("common.errors.generic", Duration.short)
            } else {
                await this.toastService.presentToast("page-auth.invalidCredentials", Duration.short)
            }
            return
        }

        await loading.dismiss();
        await this.router.navigate(['/map'])
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
        await this.router.navigate(['/map'])
    }

}
