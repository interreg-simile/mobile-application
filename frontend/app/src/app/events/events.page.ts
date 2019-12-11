import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { EventsService } from "./events.service";
import { Communication } from "./communication.model";


@Component({ selector: 'app-events', templateUrl: './events.page.html', styleUrls: ['./events.page.scss'] })
export class EventsPage implements OnInit, OnDestroy {

    /** @ignore */
    private communicationsSub: Subscription;

    /** Flag that stats if the page is waiting data from the server. */
    public isLoading = false;

    /** Array of communications retrieved from the server. */
    public communications: Communication[] = [];


    /** @ignore */
    constructor(private eventsService: EventsService) { }


    /** @ignore */
    ngOnInit() {

        // Subscribe to the communications of the "eventsService"
        this.communicationsSub = this.eventsService.communications.subscribe(data => this.communications = data);

    }


    /** @ignore */
    ionViewWillEnter() {

        // Set is loading to true
        this.isLoading = true;

        // Retrieve all the communications from the server
        this.eventsService.getAllCommunications()
            .then(() => this.isLoading = false)
            .catch(err => console.log(err))

    }


    /** @ignore */
    ngOnDestroy() {

        // Unsubscribe from the communications subscription
        if (this.communicationsSub) this.communicationsSub.unsubscribe();

    }


    /**
     * Triggers the fetching of the data from the server. It is called when the user pulls down the page to refresh the
     * content.
     *
     * @param $event - The event object.
     */
    onRefresh($event) {

        this.eventsService.addReadCommunication("test")
            .then(() => {

                $event.target.complete()

            })
            .catch(err => console.error(err));

    }


    onCommunicationClick(communication: Communication) {

        this.eventsService.addReadCommunication(communication.id)
            .then(() => {

                console.log("Communication added");

                communication.read = true;

            })
            .catch(err => console.error(err));

    }

}
