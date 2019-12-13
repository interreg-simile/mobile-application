import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface"
import { AuthService } from "../auth/auth.service";
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";


export const STORAGE_KEY_ALERTS = "communications";
export const STORAGE_KEY_EVENTS = "event";


/** Handles the logic behind the communication with the API with regard to events and communications. */
@Injectable({ providedIn: 'root' })
export class NewsService {

    /** @ignore */ private _alerts = new BehaviorSubject<Alert[]>([]);
    /** @ignore */ private _events = new BehaviorSubject<Event[]>([]);


    /** @ignore */
    constructor(private http: HttpClient, private storage: Storage, private auth: AuthService) { }


    /** Observable that contains the alerts retrieved from the server. */
    get alerts() { return this._alerts.asObservable() }

    /** Observable that contains the events retrieved from the server. */
    get events() { return this._events.asObservable() }


    /**
     * Fetches all the not-ended alerts from the server ordered by date descending and updates the
     * BehaviourSubject that holds the alerts list.
     */
    async fetchAlerts() {

        // Url of the request
        const url = `${ environment.apiUrl }/communications/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("orderByDate", "true")
            .set("rois", this.auth.rois.join());

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the alerts from the server
        const data = res.data.communications;

        // Retrieve the id of the read alert form the local storage
        const read = <string[]>await this.storage.get(STORAGE_KEY_ALERTS) || [];

        // Initialize the alerts array
        const alerts: Alert[] = [];

        // For each alert, create a new instance and push it into the array
        for (const alert of data) {

            alerts.push(new Alert(
                alert._id,
                alert.titleIta,
                alert.titleEng,
                alert.contentIta,
                alert.contentEng,
                new Date(alert.dateStart),
                new Date(alert.dateEnd),
                alert.rois,
                read.includes(alert._id)
            ))

        }

        // Clean the saved alerts
        await this.cleanSavedData(STORAGE_KEY_ALERTS, alerts.map(e => e.id));

        // Update the alert subject
        this._alerts.next(alerts);

    }


    /**
     * Fetches all the not-ended events from the server ordered by date ascending and updates the
     * BehaviourSubject that holds the events list.
     */
    async fetchEvents() {

        // Url of the request
        const url = `${ environment.apiUrl }/events/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("orderByDate", "true")
            .set("rois", this.auth.rois.join());

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the events from the server
        const data = res.data.events;

        // Retrieve the id of the read events form the local storage
        const read = <string[]>await this.storage.get(STORAGE_KEY_EVENTS) || [];

        // Initialize the events array
        const events: Event[] = [];

        // For each alert, create a new instance and push it into the array
        for (const event of data) {

            events.push(new Event(
                event._id,
                event.titleIta,
                event.titleEng,
                event.descriptionIta,
                event.descriptionEng,
                event.position,
                event.address,
                event.rois,
                new Date(event.date),
                event.imageUrl,
                read.includes(event._id)
            ))

        }

        // Clean the saved alerts
        await this.cleanSavedData(STORAGE_KEY_EVENTS, events.map(e => e.id));

        // Update the alert subject
        this._events.next(events);

    }


    /**
     * Finds the alert with the given id.
     *
     * @param {string} id - The id of the alert.
     * @returns {Alert} The alert.
     */
    getAlertById(id) { return this._alerts.getValue().find(e => e.id === id) }


    /**
     * Finds the event with the given id.
     *
     * @param {string} id - The id of the event.
     * @returns {Alert} The alert.
     */
    getEventById(id) { return this._events.getValue().find(e => e.id === id) }


    /**
     * Adds a new data to the array saved with the given key in the local storage.
     *
     * @param{string} key - The storage key of the resource.
     * @param {string} id - The id of the alert.
     */
    async saveData(key, id) {

        // Retrieve the data
        const data = <String[]>await this.storage.get(key);

        // If no data are found, just insert the id
        if (!data) return this.storage.set(key, [id]);

        // If the id is not already saved
        if (!data.includes(id)) {

            // Push the new id in the array
            data.push(id);

            // Save the array
            await this.storage.set(key, data);

        }

    }


    /**
     * Removes from the local storage the ids that are not in the given id array.
     *
     * @param {string} key - The storage key of the resource to clean.
     * @param {string[]} ids - The id array.
     */
    private async cleanSavedData(key: string, ids: string[]) {

        // Retrieve the data
        const data = <string[]>await this.storage.get(key);

        // If no data are found, return
        if (!data) return;

        // Remove the ids not in the given array
        await this.storage.set(key, data.filter(e => ids.includes(e)));

    }

}
