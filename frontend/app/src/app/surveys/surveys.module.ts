import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SurveysPage } from './surveys.page';
import { TranslateModule } from "@ngx-translate/core";
import { SurveyItemComponent } from "./survey-item/survey-item.component";

const routes: Routes = [
    {
        path     : '',
        component: SurveysPage
    }
];

@NgModule({
    imports     : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations: [SurveysPage, SurveyItemComponent]
})
export class SurveysPageModule {}
