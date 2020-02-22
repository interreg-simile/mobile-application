import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import * as cloneDeep from "lodash/cloneDeep";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface";
import { Observation } from "./observation.model";
import { LatLng } from "leaflet";
import { isEmpty } from "rxjs/operators";


/**
 * Service to handle the observations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Injectable({ providedIn: 'root' })
export class ObservationsService {


    /** @ignore */ private _obs = new BehaviorSubject<any[]>([]);


    /** The current observation that is being created. */
    public newObservation: Observation;


    /** Observable that contains the observations from the server. */
    get observations() { return this._obs.asObservable() }


    /** @ignore */
    constructor(private http: HttpClient) { }


    async fetchObservations() {

        // Url of the request
        const url = `${ environment.apiUrl }/observations/`;

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url).toPromise();

        const data = res.data.observations;

        this._obs.next(data);

    }


    /**
     * Calls the API to get the current weather data for a give point.
     *
     * @param {LatLng} coords - The coordinates of the point.
     * @returns {Promise<Object>} - The weather data.
     */
    async getWeatherData(coords: LatLng): Promise<{ sky: number, temperature: number, wind: number }> {

        // Url of the request
        const url = `${ environment.apiUrl }/misc/weather`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("lat", coords.lat.toString())
            .set("lon", coords.lng.toString());

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Return the data
        return res.data;

    }


    /**
     * Sends a new observation to the server-
     */
    async postObservation() {

        // Deep clone the observation
        const obs = cloneDeep(this.newObservation);

        // ToDo handle photos
        delete obs.photos;

        // Put the coordinates in an array
        obs.position.coordinates = [obs.position.coordinates.lng, obs.position.coordinates.lat];

        // For each of the details
        Object.keys(obs.details).forEach(k => {

            // If the key is other, return
            if (k === "other") return;

            // Remove the checked and component properties
            delete obs.details[k].checked;
            delete obs.details[k].component;

            // If the key is odours and the origin array is empty, set it to undefined
            if (k === "odours" && obs.details[k].origin.length === 0) obs.details[k].origin = undefined;

            // If the key is litters and the type array is empty, set it to undefined
            if (k === "litters" && obs.details[k].type.length === 0) obs.details[k].type = undefined;

        });

        // Create a new FormData
        const formData = new FormData();

        // Put all the observation data into the FormData
        Object.keys(obs).forEach(k => formData.append(k, JSON.stringify(obs[k])));

        // ToDo remove
        formData.forEach(d => console.log(d));


        // Url of the request
        const url = `${ environment.apiUrl }/observations/`;

        // Send the post request
        const res = await this.http.post<GenericApiResponse>(url, formData).toPromise();

        // Return the new observation
        return res.data;

    }


    /** Sets the new observation to null. */
    resetNewObservation() { this.newObservation = null }


}
