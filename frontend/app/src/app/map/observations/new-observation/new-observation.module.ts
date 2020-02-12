import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewObservationPage } from './new-observation.page';
import { TranslateModule } from "@ngx-translate/core";
import { ChoicesComponent } from "./choices/choices.component";


const routes: Routes = [{ path: '', component: NewObservationPage }];

@NgModule({
    entryComponents: [ChoicesComponent],
    imports        : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations   : [NewObservationPage, ChoicesComponent]
})
export class NewObservationPageModule {}
