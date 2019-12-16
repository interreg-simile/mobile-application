import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SingleAlertPage } from './single-alert.page';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [{ path: '', component: SingleAlertPage }];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations: [SingleAlertPage]
})
export class SingleAlertPageModule {}
