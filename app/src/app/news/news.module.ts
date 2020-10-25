import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {NewsPage} from './news.page';
import {AlertsComponent} from './alerts/alerts.component';
import {EventsComponent} from './events/events.component';

const routes: Routes = [{path: '', component: NewsPage}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [NewsPage, AlertsComponent, EventsComponent],
})
export class NewsPageModule {
}
