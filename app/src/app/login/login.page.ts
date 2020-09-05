import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { RegistrationModalComponent } from "./registration-modal/registration-modal.component";

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'] })
export class LoginPage implements OnInit {

    constructor(private modalCtr: ModalController) { }

    ngOnInit() {
        this.onRegisterClick()
    }

    async onRegisterClick(): Promise<void> {
        const modal = await this.modalCtr.create({
            component      : RegistrationModalComponent,
            backdropDismiss: false,
        })
        await modal.present();
    }

}
