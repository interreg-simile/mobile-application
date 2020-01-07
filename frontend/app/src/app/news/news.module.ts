import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from "@ngx-translate/core";

import { NewsPage } from './news.page';
import { AlertsComponent } from "./alerts/alerts.component";
import { EventsComponent } from "./events/events.component";
import { FilterComponent } from "./events/filter/filter.component";


const routes: Routes = [{ path: '', component: NewsPage }];


@NgModule({
    imports        : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    entryComponents: [FilterComponent],
    declarations   : [NewsPage, AlertsComponent, EventsComponent, FilterComponent]
})
export class NewsPageModule {}
