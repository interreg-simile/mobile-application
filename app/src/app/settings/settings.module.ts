import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {SettingsPage} from './settings.page';
import {ChangeEmailComponent} from './change-email/change-email.component';
import {ChangeInfoComponent} from './change-info/change-info.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const routes: Routes = [{path: '', component: SettingsPage}];

@NgModule({
  entryComponents: [
    ChangeEmailComponent,
    ChangePasswordComponent,
    ChangeInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [
    SettingsPage,
    ChangeEmailComponent,
    ChangeInfoComponent,
    ChangePasswordComponent,
  ],
})
export class SettingsPageModule {
}
