import { Component, OnDestroy, OnInit } from '@angular/core';
import { Alert } from "./alerts/alert.model";
import { NewsService } from "./news.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";


enum Segments { ALERTS, EVENTS}


@Component({ selector: 'app-news', templateUrl: './news.page.html', styleUrls: ['./news.page.scss'] })
export class NewsPage implements OnInit, OnDestroy {


    /** @ignore */ private _alertsSub: Subscription;


    /** Possible values of the segments. */
    public segmentsEnum = Segments;

    /** Currently selected segment. */
    public selectedSegment: Segments = this.segmentsEnum.ALERTS;

    /** Flag that states if the app is waiting data form the server. */
    public isLoading = false;

    /** Flag that states if an error occurred. */
    public hasError = false;

    /** Array of alerts retrieved from the server. */
    public alerts: Alert[];


    public navError;


    /** @ignore */
    constructor(private newsService: NewsService, private route: ActivatedRoute) { }


    /** @ignore */
    ngOnInit() {

        this._alertsSub = this.newsService.alerts.subscribe(alerts => this.alerts = alerts);

        this.navError = window.history.state.error;

        console.log(this.navError);

    }


    ionViewWillEnter() {

        // Set is loading to true
        this.isLoading = true;

        // Fetch all the alerts
        this.newsService.fetchAlerts()
            .then(() => {
                this.hasError  = false;
                this.isLoading = false;
            })
            .catch(err => {
                console.error(err);
                this.hasError  = true;
                this.isLoading = false;
            })

    }


    onSegmentChange($event: CustomEvent) {

        this.selectedSegment = +$event.detail.value;

    }


    ngOnDestroy() {

        if (this._alertsSub) this._alertsSub.unsubscribe();

    }


}
