import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";

import { environment } from "../../environments/environment";
import { genericApiResponse } from "../shared/utils.interface"
import { AuthService } from "../auth/auth.service";
import { Alert } from "./alerts/alert.model";


const STORAGE_KEY_ALERTS = "communications";


/** Handles the logic behind the communication with the API with regard to events and communications. */
@Injectable({ providedIn: 'root' })
export class NewsService {

    /** @ignore */ private _alerts = new BehaviorSubject<Alert[]>([]);


    /** @ignore */
    constructor(private http: HttpClient, private storage: Storage, private auth: AuthService) { }


    /** Observable that contains the alerts retrieved from the server. */
    get alerts() { return this._alerts.asObservable() }


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
        const res = await this.http.get<genericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the alerts from the server
        const data = res.data.communications;

        // Retrieve the id of the read alert form the local storage
        const read = <string[]>await this.getReadAlerts() || [];

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
        await this.cleanSavedAlerts(alerts.map(e => e.id));

        // Update the alert subject
        this._alerts.next(alerts);

    }


    /**
     * Finds the alert with the given id.
     *
     * @param {string} id - The id of the alert.
     * @returns {Alert} The alert.
     */
    getAlertById(id) { return this._alerts.getValue().find(e => e.id === id) }


    /**
     * Retrieves the array of read alerts ids from the local storage.
     *
     * @returns {Promise<string[]>} A promise containing the result of the query.
     */
    getReadAlerts() { return this.storage.get(STORAGE_KEY_ALERTS) }


    /**
     * Adds a new alert to the array of read ones saved in the local storage.
     *
     * @param {string} id - The id of the alert.
     */
    async addReadAlert(id) {

        // Retrieve the ids of the read communications from the local storage
        const read = <String[]>await this.getReadAlerts();

        // If no communications are save, just insert the id
        if (!read) return this.storage.set(STORAGE_KEY_ALERTS, [id]);

        // If the id is not already saved
        if (!read.includes(id)) {

            // Push the new id in the array
            read.push(id);

            // Save the array
            await this.storage.set(STORAGE_KEY_ALERTS, read);

        }

    }


    /**
     * Removes from the local storage the alert ids that are not in the given id array.
     *
     * @param {string[]} ids - The id array.
     */
    async cleanSavedAlerts(ids: string[]) {

        const read = <string[]>await this.getReadAlerts();

        if (!read) return;

        await this.storage.set(STORAGE_KEY_ALERTS, read.filter(e => ids.includes(e)));

    }

}
