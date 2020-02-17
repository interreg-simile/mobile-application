import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewObservationPage } from './new-observation.page';
import { TranslateModule } from "@ngx-translate/core";
import { ChoicesComponent } from "../choices/choices.component";
import { AlgaeComponent } from "../details/algae/algae.component";
import { FoamsComponent } from "../details/foams/foams.component";
import { OilsComponent } from "../details/oils/oils.component";
import { LittersComponent } from "../details/litters/litters.component";
import { OdoursComponent } from "../details/odours/odours.component";
import { OutletsComponent } from "../details/outlets/outlets.component";
import { FaunaComponent } from "../details/fauna/fauna.component";


const routes: Routes = [{ path: '', component: NewObservationPage }];

@NgModule({
    entryComponents: [
        ChoicesComponent,
        AlgaeComponent,
        FoamsComponent,
        OilsComponent,
        LittersComponent,
        OdoursComponent,
        OutletsComponent,
        FaunaComponent
    ],
    imports        : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations   : [
        NewObservationPage,
        ChoicesComponent,
        AlgaeComponent,
        FoamsComponent,
        OilsComponent,
        LittersComponent,
        OdoursComponent,
        OutletsComponent,
        FaunaComponent
    ]
})
export class NewObservationPageModule {}
