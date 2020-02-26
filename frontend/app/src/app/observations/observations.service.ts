import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as cloneDeep from "lodash/cloneDeep";
import { File, FileEntry } from "@ionic-native/file/ngx";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface";
import { Observation } from "./observation.model";
import { LatLng } from "leaflet";


export interface MinimalObservation {
    _id: string,
    uid: string,
    position: { coordinates: Array<number>, roi?: string }
}


/**
 * Service to handle the observations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Injectable({ providedIn: 'root' })
export class ObservationsService {


    /** @ignore */ private _obs = new BehaviorSubject<Array<MinimalObservation>>([]);


    /** The current observation that is being created. */
    public newObservation: Observation;


    /** Observable that contains the observations from the server. */
    get observations() { return this._obs.asObservable() }


    /** @ignore */
    constructor(private http: HttpClient, private file: File) { }


    /**
     * Retrieves all the observations from the server,
     *
     * @return {Promise<>} An empty promise.
     */
    async fetchObservations(): Promise<void> {

        // Url of the request
        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/observations/`;

        // Query parameters of the request
        const qParams = new HttpParams()
            .set("minimalRes", "true")
            .set("excludeOutOfRois", "true");

        // Retrieve the data from the server and return them as a promise
        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        // Emit the data
        this._obs.next(res.data);

    }


    /**
     * Calls the API to get the current weather data for a give point.
     *
     * @param {LatLng} coords - The coordinates of the point.
     * @returns {Promise<Object>} - The weather data.
     */
    async getWeatherData(coords: LatLng): Promise<{ sky: number, temperature: number, wind: number }> {

        // Url of the request
        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/misc/weather`;

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
     * Sends a new observation to the server.
     *
     * @return {Promise<>} An empty promise.
     */
    async postObservation(): Promise<void> {

        // Deep clone the observation
        const obs = cloneDeep(this.newObservation);

        // Create a new FormData
        const formData = new FormData();


        // For each of the photos
        for (let i = 0; i < obs.photos.length; i++) {

            // If the photo is provided, append it to the formData
            if (obs.photos[i]) await this.appendImage(formData, obs.photos[i], "photos");

        }

        // Delete the photos
        delete obs.photos;

        // If a signage photo is provided
        if (obs.details.outlets.signagePhoto) {

            // Append it to the formData
            await this.appendImage(formData, obs.details.outlets.signagePhoto, "signage");

            // Set it to undefined
            obs.details.outlets.signagePhoto = undefined;

        }


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

        // Put all the observation data into the FormData
        Object.keys(obs).forEach(k => formData.append(k, JSON.stringify(obs[k])));


        // Url of the request
        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/observations/`;

        // Query parameters of the request
        const qParams = new HttpParams().set("minimalRes", "true");

        // Send the post request
        const res = await this.http.post<GenericApiResponse>(url, formData, { params: qParams }).toPromise();

        // Save the new observation
        const data = <MinimalObservation> res.data;

        // Emit the new observation
        if (data.position.roi) this._obs.next([...this._obs.value, data]);

    }


    /**
     * Appends an image to a given formData.
     *
     * @param {FormData} formData - The formData.
     * @param {string} url - The url of the photo.
     * @param {string} field - The name of the field.
     * @return {Promise<>} An empty promise.
     */
    appendImage(formData: FormData, url: string, field: string): Promise<void> {

        // Return a promise
        return new Promise((resolve, reject) => {

            // Resolve the url of the image
            this.file.resolveLocalFilesystemUrl(url)
                .then((entry: FileEntry) => {

                    // Resolve the file
                    entry.file(file => {

                        // Create a new reader
                        const reader = new FileReader();

                        // When the reader has finished loading the file
                        reader.onloadend = () => {

                            // Create a blob
                            const imgBlob = new Blob([reader.result], { type: "image/jpeg" });

                            // Append it to the formData
                            formData.append(field, imgBlob, file.name);

                            // Resolve the promise
                            resolve()

                        };

                        // If there is an error, reject the promise
                        reader.onerror = err => reject(err);

                        // Read the file
                        reader.readAsArrayBuffer(file);

                    }, err => reject(err));

                })
                .catch(err => reject(err));

        });

    }


    /** Sets the new observation to null. */
    resetNewObservation(): void { this.newObservation = null }


}
