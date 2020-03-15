import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { LatLng } from "leaflet";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface"
import { Alert } from "./alerts/alert.model";
import { Event } from "./events/event.model";


@Injectable({ providedIn: 'root' })
export class NewsService {

    public readonly storageKeyAlerts = "alerts";
    public readonly storageKeyEvents = "events";

    private _alerts    = new BehaviorSubject<Array<Alert>>([]);
    private _events    = new BehaviorSubject<Array<Event>>([]);
    private _newAlerts = new BehaviorSubject<boolean>(false);
    private _newEvents = new BehaviorSubject<boolean>(false);

    get alerts() { return this._alerts.asObservable() }

    get events() { return this._events.asObservable() }

    get areNewAlerts() { return this._newAlerts.asObservable() }

    get areNewEvents() { return this._newEvents.asObservable() }


    constructor(private http: HttpClient,
                private storage: Storage,
                private i18n: TranslateService) {}


    /** Fetches all the not-ended alerts from the server ordered by date descending. */
    async fetchAlerts(): Promise<void> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/alerts/`;

        const qParams = new HttpParams()
            .set("includePast", "false")
            .set("sort", "createdAt:desc");

        const res  = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();
        const data = res.data;

        const read = <string[]>await this.storage.get(this.storageKeyAlerts) || [];

        const alerts: Array<Alert> = [];

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

        await this.cleanSavedData(this.storageKeyAlerts, alerts.map(e => e.id));

        this._alerts.next(alerts);

        await this.checkNewAlerts();

    }


    /** Fetches all the not-ended events from the server ordered by date ascending. */
    async fetchEvents(): Promise<void> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/events/`;

        const qParams = new HttpParams()
            .set("includePast", "false")
            .set("sort", "date:asc");

        const res  = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();
        const data = res.data;

        const read = <string[]>await this.storage.get(this.storageKeyEvents) || [];

        const events: Array<Event> = [];

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

        await this.cleanSavedData(this.storageKeyEvents, events.map(e => e.id));

        this._events.next(events);

        await this.checkNewEvents();

    }


    /**
     * Finds the alert with the given id.
     *
     * @param {string} id - The id of the alert.
     * @return {Alert} The alert.
     */
    getAlertById(id): Alert { return this._alerts.getValue().find(e => e.id === id) }

    /**
     * Finds the event with the given id.
     *
     * @param {string} id - The id of the event.
     * @return {Event} The event.
     */
    getEventById(id): Event { return this._events.getValue().find(e => e.id === id) }


    /**
     * Adds a new data to the array saved with the given key in the local storage.
     *
     * @param{string} key - The storage key of the resource.
     * @param {string} id - The id of the alert.
     */
    async saveData(key: string, id: string): Promise<void> {

        const data = <String[]>await this.storage.get(key);

        if (!data) return this.storage.set(key, [id]);

        if (!data.includes(id)) {
            data.push(id);
            await this.storage.set(key, data);
        }

    }


    /**
     * Removes from the local storage the ids that are not in the given id array.
     *
     * @param {string} key - The storage key of the resource to clean.
     * @param {string[]} ids - The id array.
     */
    private async cleanSavedData(key: string, ids: Array<string>): Promise<void> {

        const data = <string[]>await this.storage.get(key);

        if (!data) return;

        await this.storage.set(key, data.filter(e => ids.includes(e)));

    }


    /** Checks if there are some unread alerts and updates the local storage flag accordingly. */
    async checkNewAlerts(): Promise<void> {

        const areNew = this._alerts.getValue().some(e => !e.read);

        this._newAlerts.next(areNew);

    }

    /** Checks if there are some unread events and updates the local storage flag accordingly. */
    async checkNewEvents(): Promise<void> {

        const areNew = this._events.getValue().some(e => !e.read);

        this._newEvents.next(areNew);

    }

}
