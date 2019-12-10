import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';

import { EventsPage } from './events.page';
import { CommunicationItemComponent } from "./communication-item/communication-item.component";

const routes: Routes = [{ path: '', component: EventsPage }];

@NgModule({
    imports     : [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule
    ],
    declarations: [EventsPage, CommunicationItemComponent, CommunicationItemComponent]
})
export class EventsPageModule {}
