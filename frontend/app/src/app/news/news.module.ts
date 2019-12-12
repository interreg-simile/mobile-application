import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewsPage } from './news.page';
import { TranslateModule } from "@ngx-translate/core";
import { AlertsComponent } from "./alerts/alerts.component";

const routes: Routes = [{ path: '', component: NewsPage }];

@NgModule({
    imports     : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations: [NewsPage, AlertsComponent]
})
export class NewsPageModule {}
