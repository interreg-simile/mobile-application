import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { NGXLogger } from "ngx-logger";

import { NewsService } from "./news.service";
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";
import { Duration, ToastService } from "../shared/toast.service";
import { ConnectionStatus, NetworkService } from "../shared/network.service";


enum Segments { ALERTS, EVENTS}


@Component({ selector: 'app-news', templateUrl: './news.page.html', styleUrls: ['./news.page.scss'] })
export class NewsPage implements OnInit, OnDestroy {

    private _alertsSub: Subscription;
    private _eventsSub: Subscription;
    private _newAlertsSub: Subscription;
    private _newEventsSub: Subscription;

    public segmentsEnum              = Segments;
    public selectedSegment: Segments = this.segmentsEnum.EVENTS;

    public isLoading = false;

    public alerts: Alert[];
    public events: Event[];

    public newAlerts: boolean;
    public newEvents: boolean;


    constructor(private newsService: NewsService,
                private toastService: ToastService,
                private logger: NGXLogger,
                private networkService: NetworkService) { }


    ngOnInit(): void {

        this._alertsSub    = this.newsService.alerts.subscribe(alerts => this.alerts = alerts);
        this._eventsSub    = this.newsService.events.subscribe(events => this.events = events);
        this._newAlertsSub = this.newsService.areNewAlerts.subscribe(v => this.newAlerts = v);
        this._newEventsSub = this.newsService.areNewEvents.subscribe(v => this.newEvents = v);

    }


    /**
     * Called when the user changes the segment. If it is the first time the user visits the event page, it fetches the
     * events form the server.
     *
     * @param {CustomEvent} e - The Ionic change event.
     */
    onSegmentChange(e: CustomEvent): void { this.selectedSegment = +e.detail.value }


    /**
     * Called when the user scrolls down to refresh. It fetches the events and the alerts from the server.
     *
     * @param {CustomEvent} e - The refresh event.
     */
    onRefresh(e: any): void {

        if (!this.networkService.checkOnlineContentAvailability()) {
            e.target.complete();
            return;
        }

        const pEvents = this.newsService.fetchEvents();
        const pAlerts = this.newsService.fetchAlerts();

        Promise.all([pEvents, pAlerts])
            .catch(err => {
                this.logger.error("Error refreshing the page.", err);
                this.toastService.presentToast("page-news.fetch-error", Duration.short);
            })
            .finally(() => e.target.complete());

    }


    ngOnDestroy(): void {

        if (this._alertsSub) this._alertsSub.unsubscribe();
        if (this._eventsSub) this._eventsSub.unsubscribe();
        if (this._newAlertsSub) this._newAlertsSub.unsubscribe();
        if (this._newEventsSub) this._newEventsSub.unsubscribe();

    }


}
