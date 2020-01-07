import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { PopoverController } from "@ionic/angular";

import { NewsService } from "./news.service";
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";
import { FilterComponent } from "./events/filter/filter.component";


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
    public selectedSegment: Segments = this.segmentsEnum.ALERTS;

    /** Flag that states if the app is waiting data form the server. */
    public isLoading = false;

    /** Flag that states if an error related to the alerts occurred. */
    public alertError = false;

    /** Flag that states if an error related to the events occurred. */
    public eventError = false;

    /** Array of alerts retrieved from the server. */
    public alerts: Alert[];

    /** Array of events retrieved from the server. */
    public events: Event[];

    /** Flag that states if there are unread alerts. */
    public newAlerts: Boolean;

    /** Flag that states if there are unread events. */
    public newEvents: Boolean;


    public navError;


    /** @ignore */
    constructor(private newsService: NewsService, private popoverCtrl: PopoverController) { }


    /** @ignore */
    ngOnInit() {

        // Subscribe to the changes of the alerts array in the newsService
        this._alertsSub = this.newsService.alerts.subscribe(alerts => this.alerts = alerts);

        // Subscribe to the observables that state if the are unread alerts and events
        this._newAlertsSub = this.newsService.areNewAlerts.subscribe(v => this.newAlerts = v);
        this._newEventsSub = this.newsService.areNewEvents.subscribe(v => this.newEvents = v);

        // Extract the navigation errors
        this.navError = window.history.state.error;

    }


    /** @ignore */
    ionViewWillEnter() {

        // Set is loading to true
        this.isLoading = true;

        // Fetch all the alerts
        this.newsService.fetchAlerts()
            .then(() => this.alertError = false)
            .catch(err => {
                console.error(err);
                this.alertError = true;
            })
            .finally(() => this.isLoading = false)

    }


    /**
     * Called when the user changes the segment. If it is the first time the user visits the event page, it fetches the
     * events form the server.
     *
     * @param {CustomEvent} $event - The Ionic change event
     */
    onSegmentChange($event: CustomEvent) {

        // Save the selected segment
        this.selectedSegment = +$event.detail.value;

        // If it is the first time the user goes to the events page
        if (this.selectedSegment === Segments.EVENTS && !this.events) {

            this.isLoading = true;

            // Subscribe to the changes of the events array in the newsService
            this._eventsSub = this.newsService.events.subscribe(events => this.events = events);

            // Fetch all the events
            this.newsService.fetchEvents()
                .then(() => this.eventError = false)
                .catch(err => {
                    console.error(err);
                    this.eventError = true;
                })
                .finally(() => this.isLoading = false)

        }

    }


    onRefresh($event) {

        if (this.selectedSegment === Segments.ALERTS) {

            this.newsService.fetchAlerts()
                .then(() => this.alertError = false)
                .catch(err => {
                    console.error(err);
                    this.alertError = true;
                })
                .finally(() => $event.target.complete())

        }

        if (this.selectedSegment === Segments.EVENTS) {

            this.newsService.fetchEvents()
                .then(() => this.eventError = false)
                .catch(err => {
                    console.error(err);
                    this.eventError = true;
                })
                .finally(() => $event.target.complete())

        }

    }


    /**
     * Open the events filter popover.
     *
     * @param event - The click event.
     */
    async filterPopover(event) {

        // Create the popover
        const popover = await this.popoverCtrl.create({
            component: FilterComponent,
            event    : event
        });

        // Called when the popover is closed
        popover.onWillDismiss().then(() => {

            if (this.newsService.compareRois()) return;

            // Set is loading to true
            this.isLoading = true;

            // Fetch all the events
            this.newsService.fetchEvents()
                .then(() => this.eventError = false)
                .catch(err => {
                    console.error(err);
                    this.eventError = true;
                })
                .finally(() => this.isLoading = false)

        });

        // Open the popover
        return await popover.present();

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
