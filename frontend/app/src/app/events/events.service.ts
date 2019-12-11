import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";

import { environment } from "../../environments/environment";
import { genericApiResponse } from "../shared/utils.interface";
import { Communication } from "./communication.model";
import { AuthService } from "../auth/auth.service";


const STORAGE_KEY_COMMUNICATIONS = "communications";


/** Handles the logic behind the communication with the API with regard to events and communications. */
@Injectable({ providedIn: 'root' })
export class EventsService {

    /** @ignore */
    private _communications = new BehaviorSubject<Communication[]>([]);


    /** @ignore */
    constructor(private http: HttpClient, private storage: Storage, private auth: AuthService) { }


    /** Observable that contains the communications retrieved from the server. */
    get communications() { return this._communications.asObservable() }


    /**
     * Fetches all the not-ended communications from the server ordered by date descending and updates the
     * BehaviourSubject that holds the communication list.
     */
    async getAllCommunications() {

        // Url of the request
        const url = `${ environment.apiUrl }/communications/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("orderByDate", "true")
            .set("rois", this.auth.rois.join());

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<genericApiResponse>(url, { params: qParams }).toPromise();

        // Extract the communications from the server
        const data = res.data.communications;

        // Retrieve the id of the read communications form the local storage
        const read = <string[]>await this.getReadCommunications() || [];

        // Initialize the communications array
        const communications: Communication[] = [];

        // For each communication, create a new instance and push it into the array
        for (const c of data) {

            communications.push(new Communication(
                c._id,
                c.titleIta,
                c.titleEng,
                c.contentIta,
                c.contentEng,
                new Date(c.dateStart),
                new Date(c.dateEnd),
                c.rois,
                read.includes(c._id)
            ))

        }

        // Clean the saved communications
        await this.cleanSavedCommunications(communications.map(e => e.id));

        // Update the communications subject
        this._communications.next(communications);

    }


    getCommunicationById(id) { return this._communications.getValue().find(e => e.id === id) }


    /**
     * Retrieves the array of read communication ids from the local storage.
     *
     * @returns {Promise<string[]>} A promise containing the result of the query.
     */
    getReadCommunications() { return this.storage.get(STORAGE_KEY_COMMUNICATIONS) }


    /**
     * Adds a new communication to the array of read ones saved in the local storage.
     *
     * @param {string} id - The id of the communication.
     */
    async addReadCommunication(id) {

        // Retrieve the ids of the read communications from the local storage
        const read = <String[]>await this.getReadCommunications();

        // If no communications are save, just insert the id
        if (!read) return this.storage.set(STORAGE_KEY_COMMUNICATIONS, [id]);

        // If the id is not already saved
        if (!read.includes(id)) {

            // Push the new id in the array
            read.push(id);

            // Save the array
            await this.storage.set(STORAGE_KEY_COMMUNICATIONS, read);

        }

    }


    /**
     * Removes from the local storage the communication ids that are not in the given id array.
     *
     * @param {string[]} ids - The id array.
     */
    async cleanSavedCommunications(ids: string[]) {

        const read = <string[]>await this.getReadCommunications();

        if (!read) return;

        await this.storage.set(STORAGE_KEY_COMMUNICATIONS, read.filter(e => ids.includes(e)));

    }

}
