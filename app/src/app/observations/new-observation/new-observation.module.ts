import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NewObservationPage} from './new-observation.page';
import {TranslateModule} from '@ngx-translate/core';
import {AlgaeComponent} from '../details/algae/algae.component';
import {FoamsComponent} from '../details/foams/foams.component';
import {OilsComponent} from '../details/oils/oils.component';
import {LittersComponent} from '../details/litters/litters.component';
import {OdoursComponent} from '../details/odours/odours.component';
import {OutletsComponent} from '../details/outlets/outlets.component';
import {FaunaComponent} from '../details/fauna/fauna.component';
import {HubComponent} from '../measures/hub/hub.component';
import {BacteriaComponent} from '../measures/bacteria/bacteria.component';
import {OxygenComponent} from '../measures/oxygen/oxygen.component';
import {PhComponent} from '../measures/ph/ph.component';
import {TemperatureComponent} from '../measures/temperature/temperature.component';
import {TransparencyComponent} from '../measures/transparency/transparency.component';
import {InstrumentComponent} from '../measures/instrument/instrument.component';
import {CallAuthoritiesComponent} from '../call-authorities/call-authorities.component';

const routes: Routes = [{path: '', component: NewObservationPage}];

@NgModule({
  entryComponents: [
    AlgaeComponent,
    FoamsComponent,
    OilsComponent,
    LittersComponent,
    OdoursComponent,
    OutletsComponent,
    FaunaComponent,
    HubComponent,
    BacteriaComponent,
    OxygenComponent,
    PhComponent,
    TemperatureComponent,
    TransparencyComponent,
    CallAuthoritiesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  declarations: [
    NewObservationPage,
    AlgaeComponent,
    FoamsComponent,
    OilsComponent,
    LittersComponent,
    OdoursComponent,
    OutletsComponent,
    FaunaComponent,
    HubComponent,
    BacteriaComponent,
    OxygenComponent,
    PhComponent,
    TemperatureComponent,
    TransparencyComponent,
    InstrumentComponent,
    CallAuthoritiesComponent,
  ],
})
export class NewObservationPageModule {
}
