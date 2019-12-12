import { Component, Input, OnInit } from '@angular/core';
import { Alert } from "./alert.model";

@Component({ selector: 'app-alerts', templateUrl: './alerts.component.html', styleUrls: ['./alerts.component.scss'] })
export class AlertsComponent implements OnInit {


    /** The array of alerts to display. */
    @Input() alerts: Alert[];


    constructor() { }


    ngOnInit() {}


}
