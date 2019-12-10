import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage";

import { environment } from "../../environments/environment";
import { genericApiResponse } from "../shared/utils.interface";
import { Communication } from "./communication.model";


/** Handles the logic behind the communication with the API with regard to events and communications. */
@Injectable({ providedIn: 'root' })
export class EventsService {

    /** @ignore */
    private _communications = new BehaviorSubject<Communication[]>([]);


    /** @ignore */
    constructor(private http: HttpClient, private storage: Storage) { }


    /** Observable that contains the communications retrieved from the server. */
    get communications() { return this._communications.asObservable() }


    /**
     * Fetches all the not-ended communications from the server ordered by date descending. It also updates the
     * BehaviourSubject that holds the communication list.
     *
     * @return Observable<Communication[]> - An observable containing the communications.
     */
    getAllCommunications() {

        // Url of the request
        const url = `${ environment.apiUrl }/communications/`;

        // Fetch the data from the server
        return this.http.get<genericApiResponse>(`${ url }?includePast=true&orderByDate=true`)
            .pipe(
                map(res => {

                    // Save the data sent by the server
                    const data = res.data.communications;

                    // Initialize the communications array
                    const communications: Communication[] = [];

                    // For each communication, create a new instance and push it into the array
                    for (const c of data) {

                        communications.push(new Communication(
                            c._id,
                            c.titleIta,
                            c.titleEng,
                            c.descriptionIta,
                            c.descriptionEng,
                            new Date(c.dateStart),
                            new Date(c.dateEnd),
                            c.rois,
                            new Date(c.dateStart) < new Date()
                        ))

                    }

                    // Return the array of communications
                    return communications;

                }),
                tap(communications => this._communications.next(communications))
            )
    }

}
