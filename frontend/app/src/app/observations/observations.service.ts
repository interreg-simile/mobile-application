import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
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

        // Deep clone the new observation
        const obs = cloneDeep(this.newObservation);


        const deleteUndefined = obj => {

            console.log("================", obj);

            Object.keys(obj).forEach(k => {

                console.log("------------", k, obj[k]);

                if (obj[k] === undefined) {

                    console.log(`${k} deleted`);

                    delete obj[k];

                }

                else if (typeof obj[k] === "object") {

                    console.log(`${k} is object`);

                    deleteUndefined(obj[k]);

                    console.log(`${k} has this many keys: ${Object.keys(obj[k]).length}`);

                    if (Object.keys(obj[k]).length === 0) {

                        delete obs[k];

                        console.log(`${k} object deleted`)

                    }

                }

            });

        };





        // console.log(obs);


        // For each of the details
        Object.keys(obs.details).forEach(k => {

            // console.log(k, obs.details[k]);

            if (k === "other") {

                if (!obs.details.other) {

                    delete obs.details[k];

                    return;

                }

            }

            if (!obs.details[k].checked) {

                delete obs.details[k];

                return;

            }

            delete obs.details[k].checked;
            delete obs.details[k].component;

        });

        console.log(obs.details["algae"]);

        deleteUndefined(obs.details["algae"]);

        console.log(obs.details["algae"]);

        // Of the details object is empty, remove it
        if (Object.keys(obs.details).length === 0) delete obs.details;


        console.log(obs);

    }

}
