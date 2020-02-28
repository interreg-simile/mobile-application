import { Component, Input, OnInit } from '@angular/core';

import { SimpleInstrument } from "./instrument.service";


@Component({
    selector: 'app-instrument',
    templateUrl: './instrument.component.html',
    styleUrls: ['./instrument.component.scss'],
})
export class InstrumentComponent implements OnInit {


    @Input() instrument: SimpleInstrument;


    /** @ignore */
    constructor() { }


    /** @ignore */
    ngOnInit() { }


}
