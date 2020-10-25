import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { LoginPage } from "./login.page";
import { TranslateModule } from "@ngx-translate/core";
import { RegistrationModalComponent } from "./registration-modal/registration-modal.component";

const routes: Routes = [{ path: "", component: LoginPage }];

@NgModule({
  entryComponents: [RegistrationModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [LoginPage, RegistrationModalComponent],
})
export class LoginPageModule {}
