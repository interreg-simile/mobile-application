import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from "@ngx-translate/core";

import { MapPage } from './map.page';


const routes: Routes = [{ path: '', component: MapPage }];


@NgModule({
    imports     : [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild()
    ],
    declarations: [MapPage]
})
export class MapPageModule {}
