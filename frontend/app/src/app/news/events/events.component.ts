import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { Event } from "./event.model";


@Component({ selector: 'app-events', templateUrl: './events.component.html', styleUrls: ['./events.component.scss'] })
export class EventsComponent implements OnInit {

    @Input() events: Event[];

    public locale: string;


    constructor(private i18n: TranslateService) { }


    ngOnInit(): void { this.locale = this.i18n.currentLang }

}
