import { Component, OnInit } from '@angular/core';
import { Alert } from "./alerts/alert.model";


enum Segments { ALERTS, EVENTS}


@Component({ selector: 'app-news', templateUrl: './news.page.html', styleUrls: ['./news.page.scss'] })
export class NewsPage implements OnInit {


    public segmentsEnum = Segments;

    public selectedSegment = this.segmentsEnum.ALERTS;

    public alerts: Alert[];


    /** @ignore */
    constructor() { }


    /** @ignore */
    ngOnInit() { }


    onSegmentChange($event: CustomEvent) {

        const selected = +$event.detail.value;

        if (selected === this.segmentsEnum.ALERTS) console.log("Alerts");

        if (selected === this.segmentsEnum.EVENTS) console.log("Events");

    }


}
