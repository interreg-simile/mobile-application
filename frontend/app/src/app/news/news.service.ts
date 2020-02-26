import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface"
import { AuthService } from "../auth/auth.service";
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";
import { Rois } from "../shared/common.enum";
import { TranslateService } from "@ngx-translate/core";
import { LatLng } from "leaflet";


export const STORAGE_KEY_ALERTS = "alerts";
export const STORAGE_KEY_EVENTS = "event";


/** Handles the logic behind the communication with the API with regard to events and alerts. */
@Injectable({ providedIn: 'root' })
export class NewsService {


    /** @ignore */ private _alerts = new BehaviorSubject<Array<Alert>>([]);
    /** @ignore */ private _events = new BehaviorSubject<Array<Event>>([]);

    /** @ignore */ private _newAlerts = new BehaviorSubject<boolean>(false);
    /** @ignore */ private _newEvents = new BehaviorSubject<boolean>(false);


    /** Object with the possible rois as keys and a flag stating if the roi is among the user's ones as value. */
    public eventsRois: Object;

    /** Object with the possible rois as keys and a flag stating if the roi has been selected in the filter. */
    public newRois: Object;


    /** Observable that contains the alerts retrieved from the server. */
    get alerts() { return this._alerts.asObservable() }

    /** Observable that contains the events retrieved from the server. */
    get events() { return this._events.asObservable() }

    /** Observable that states if there are some not read alerts. */
    get areNewAlerts() { return this._newAlerts.asObservable() }

    /** Observable that states if there are some not read events. */
    get areNewEvents() { return this._newEvents.asObservable() }


    /** @ignore */
    constructor(private http: HttpClient,
                private storage: Storage,
                private auth: AuthService,
                private i18n: TranslateService) {}


    /**
     * Fetches all the not-ended alerts from the server ordered by date descending and updates the
     * BehaviourSubject that holds the alerts list.
     *
     * @return {Promise<>} - An empty promise.
     */
    async fetchAlerts(): Promise<void> {

        // Url of the request
        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/alerts/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("includePast", "false")
            .set("sort", "createdAt:desc");

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the alerts from the server
        const data = res.data;

        // Retrieve the id of the read alert form the local storage
        const read = <string[]>await this.storage.get(STORAGE_KEY_ALERTS) || [];

        // Initialize the alerts array
        const alerts: Array<Alert> = [];

        // For each alert, create a new instance and push it into the array
        for (const alert of data) {

            alerts.push({
                id       : alert._id,
                title    : alert.title[this.i18n.currentLang] || alert.title.it,
                content  : alert.content[this.i18n.currentLang] || alert.content.it,
                dateEnd  : alert.dateEnd,
                read     : read.includes(alert._id),
                createdAt: alert.createdAt
            })

        }

        // Clean the saved alerts
        await this.cleanSavedData(STORAGE_KEY_ALERTS, alerts.map(e => e.id));

        // Update the alert subject
        this._alerts.next(alerts);

        // Check for unread alerts
        await this.checkNewAlerts();

    }


    /**
     * Fetches all the not-ended events from the server ordered by date ascending and updates the
     * BehaviourSubject that holds the events list.
     *
     * @return {Promise<>} - An empty promise.
     */
    async fetchEvents(): Promise<void> {

        // Url of the request
        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/events/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("includePast", "false")
            .set("sort", "date:asc");

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the events from the server
        const data = res.data;

        // Retrieve the id of the read events form the local storage
        const read = <string[]>await this.storage.get(STORAGE_KEY_EVENTS) || [];

        // Initialize the events array
        const events: Array<Event> = [];

        // For each alert, create a new instance and push it into the array
        for (const event of data) {

            events.push({
                id         : event._id,
                title      : event.title[this.i18n.currentLang] || event.title.it,
                description: event.description[this.i18n.currentLang] || event.description.it,
                coordinates: new LatLng(event.position.coordinates[1], event.position.coordinates[0]),
                address    : event.position.address,
                city       : event.position.city,
                date       : new Date(event.date),
                contacts   : event.contacts,
                read       : read.includes(event._id)
            })

        }

        // Clean the saved alerts
        await this.cleanSavedData(STORAGE_KEY_EVENTS, events.map(e => e.id));

        // Update the events subject
        this._events.next(events);

        // Check for unread events
        await this.checkNewEvents();

    }


    /**
     * Finds the alert with the given id.
     *
     * @param {string} id - The id of the alert.
     * @return {Alert} The alert.
     */
    getAlertById(id) { return this._alerts.getValue().find(e => e.id === id) }


    /**
     * Finds the event with the given id.
     *
     * @param {string} id - The id of the event.
     * @return {Alert} The alert.
     */
    getEventById(id) { return this._events.getValue().find(e => e.id === id) }


    /**
     * Adds a new data to the array saved with the given key in the local storage.
     *
     * @param{string} key - The storage key of the resource.
     * @param {string} id - The id of the alert.
     * @return {Promise<>} - An empty promise.
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
     * @return {Promise<>} - An empty promise.
     */
    private async cleanSavedData(key: string, ids: string[]): Promise<void> {

        // Retrieve the data
        const data = <string[]>await this.storage.get(key);

        // If no data are found, return
        if (!data) return;

        // Remove the ids not in the given array
        await this.storage.set(key, data.filter(e => ids.includes(e)));

    }


    /**
     * Checks if there are some unread alerts and updates the local storage flag accordingly.
     *
     * @return {Promise<>} - An empty promise.
     */
    async checkNewAlerts() {

        const areNew = this._alerts.getValue().some(e => !e.read);

        this._newAlerts.next(areNew);

    }

    /**
     * Checks if there are some unread events and updates the local storage flag accordingly.
     *
     * @return {Promise<>} - An empty promise.
     */
    async checkNewEvents(): Promise<void> {

        const areNew = this._events.getValue().some(e => !e.read);

        this._newEvents.next(areNew);

    }


}
