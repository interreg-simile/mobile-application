import { Component, Input } from '@angular/core';

import { SimpleInstrument } from "./instrument.service";


@Component({
    selector: 'app-instrument',
    templateUrl: './instrument.component.html',
    styleUrls: ['./instrument.component.scss'],
})
export class InstrumentComponent {

    @Input() measureName: string;

    @Input() instrument: SimpleInstrument;

}
