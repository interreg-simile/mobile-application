import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from "./alerts/alert.model";
import { NewsService } from "./news.service";
import { Subscription } from "rxjs";


enum Segments { ALERTS, EVENTS}


@Component({ selector: 'app-news', templateUrl: './news.page.html', styleUrls: ['./news.page.scss'] })
export class NewsPage implements OnInit, OnDestroy {


    /** @ignore */ private _alertsSub: Subscription;


    public segmentsEnum = Segments;

    public selectedSegment = this.segmentsEnum.ALERTS;

    public alerts: Alert[];


    /** @ignore */
    constructor(private newsService: NewsService) { }


    /** @ignore */
    ngOnInit() {

        this._alertsSub = this.newsService.alerts.subscribe(alerts => this.alerts = alerts);

    }


    ionViewWillEnter() {

        this.newsService.fetchAlerts()
            .then(() => {})
            .catch(err => console.error(err))

    }


    onSegmentChange($event: CustomEvent) { this.selectedSegment = +$event.detail.value }


    ngOnDestroy() {

        if (this._alertsSub) this._alertsSub.unsubscribe();

    }


}
