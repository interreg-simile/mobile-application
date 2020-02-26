import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { PopoverController } from "@ionic/angular";

import { NewsService } from "./news.service";
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";
import { Duration, ToastService } from "../shared/toast.service";


enum Segments { ALERTS, EVENTS}


@Component({ selector: 'app-news', templateUrl: './news.page.html', styleUrls: ['./news.page.scss'] })
export class NewsPage implements OnInit, OnDestroy {


    /** @ignore */ private _alertsSub: Subscription;
    /** @ignore */ private _eventsSub: Subscription;
    /** @ignore */ private _newAlertsSub: Subscription;
    /** @ignore */ private _newEventsSub: Subscription;


    /** Possible values of the segments. */
    public segmentsEnum = Segments;

    /** Currently selected segment. */
    public selectedSegment: Segments = this.segmentsEnum.EVENTS;

    /** Flag that states if the app is waiting data form the server. */
    public isLoading = false;


    public alerts: Alert[];
    public events: Event[];

    public newAlerts: boolean;
    public newEvents: boolean;


    /** @ignore */
    constructor(private newsService: NewsService, private toastService: ToastService) { }


    /** @ignore */
    ngOnInit(): void {

        // Subscribe to the changes of the alerts array in the newsService
        this._alertsSub = this.newsService.alerts.subscribe(alerts => this.alerts = alerts);
        this._eventsSub = this.newsService.events.subscribe(events => this.events = events);

        // Subscribe to the observables that state if the are unread alerts and events
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
    onRefresh(e): void {

        // Fetch all the events
        const pEvents = this.newsService.fetchEvents();

        // Fetch all the alert
        const pAlerts = this.newsService.fetchAlerts();

        // Wait for the two calls to finish
        Promise.all([pEvents, pAlerts])
            .catch(err => {

                console.error(err);

                // Alert the user
                this.toastService.presentToast("page-news.fetch-error", Duration.short);

            })
            .finally(() =>e.target.complete());

    }


    /** @ignore */
    ngOnDestroy() {

        // Unsubscribe
        if (this._alertsSub) this._alertsSub.unsubscribe();
        if (this._eventsSub) this._eventsSub.unsubscribe();
        if (this._newAlertsSub) this._newAlertsSub.unsubscribe();
        if (this._newEventsSub) this._newEventsSub.unsubscribe();

    }


}
