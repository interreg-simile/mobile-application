import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface";
import { Observation } from "./observation.model";


/**
 * Service to handle the observations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Injectable({ providedIn: 'root' })
export class ObservationsService {


    /** @ignore */ private _obs = new BehaviorSubject<any[]>([]);


    public newObservation: Observation;


    get observations() { return this._obs.asObservable() }


    /** @ignore */
    constructor(private http: HttpClient) { }


    /**
     * Query the OSM Nominatim service to retrieve the address corresponding to a given set of coordinates.
     *
     * @param {Number[]} coords - The coordinates of the place in form [lat, long].
     * @returns {Promise<String>} - The address.
     */
    async nominatimReverse(coords: Number[]) {

        // Url of the request
        const url = "https://nominatim.openstreetmap.org/reverse";

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("lat", coords[0].toString())
            .set("lon", coords[1].toString())
            .set("format", "json");

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<any>(url, { params: qParams }).toPromise();

        // If the response contains an error, throw it
        if (res.error) throw new Error(res.error);

        // Return the address
        return res.display_name;

    }


    async fetchObservations() {

        // Url of the request
        const url = `${ environment.apiUrl }/observations/`;

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url).toPromise();

        const data = res.data.observations;

        this._obs.next(data);

    }


    /**
     * Initialize the new observation.
     *
     * @param {number[]} coords - The coordinated of the new observation in form [lat, lon].
     * @param {number} accuracy - The accuracy of the coordinates.
     * @param {boolean} custom - True is the user has chosen the observation position long tapping on the map.
     */
    initNewObs(coords, accuracy, custom) { this.newObservation = new Observation(coords, accuracy, custom) }


    async postObservation() {

        console.log(this.newObservation);

    }

}
