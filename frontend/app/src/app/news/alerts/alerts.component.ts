import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

import { Alert } from "./alert.model";


@Component({ selector: 'app-alerts', templateUrl: './alerts.component.html', styleUrls: ['./alerts.component.scss'] })
export class AlertsComponent implements OnInit {

    @Input() alerts: Alert[];

    public locale: string;


    constructor(private i18n: TranslateService) { }


    ngOnInit(): void { this.locale = this.i18n.currentLang }

}
