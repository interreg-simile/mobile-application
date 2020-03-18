import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import cloneDeep from "lodash-es/cloneDeep";
import { File, FileEntry } from "@ionic-native/file/ngx";
import get from "lodash-es/get";
import { NGXLogger } from "ngx-logger";
import { LatLng } from "leaflet";

import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface";
import { Observation } from "./observation.model";
import { ObsInfo } from "./info/obs-info.model";
import { ConnectionStatus, NetworkService } from "../shared/network.service";
import { OfflineService } from "./offline.service";


export interface MinimalObservation {
    _id: string,
    // uid: string,
    position: { coordinates: Array<number>, roi?: string }
}


@Injectable({ providedIn: 'root' })
export class ObservationsService {


    private _obs = new BehaviorSubject<Array<MinimalObservation>>([]);

    public newObservation: Observation;

    get observations() { return this._obs.asObservable() }


    constructor(private http: HttpClient,
                private file: File,
                private networkService: NetworkService,
                private logger: NGXLogger,
                private offlineService: OfflineService) { }


    /** Retrieves all the observations from the server. */
    async fetchObservations(): Promise<void> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/observations/`;

        const qParams = new HttpParams()
            .set("minimalRes", "true")
            .set("excludeOutOfRois", "true");

        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        this._obs.next(res.data);

    }


    /**
     * Retrieves from the server the observation with the given id.
     *
     * @param {string} id - The id of the observation.
     * @return {Promise<ObsInfo>} A promise containing the observation.
     */
    async getObservationById(id: string): Promise<ObsInfo> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/observations/${ id }`;

        const res = await this.http.get<GenericApiResponse>(url).toPromise();

        const data = <ObsInfo>res.data;

        data.photos = data.photos.map(p => `${ environment.apiBaseUrl }/${ p }`);

        if (get(data, "details.outlets.signagePhoto"))
            data.details.outlets.signagePhoto = `${ environment.apiBaseUrl }/${ data.details.outlets.signagePhoto }`;

        return data;

    }


    /**
     * Calls the API to get the current weather data for a give point.
     *
     * @param {LatLng} coords - The coordinates of the point.
     * @returns {Promise<Object>} - The weather data.
     */
    async getWeatherData(coords: LatLng): Promise<{ sky: number, temperature: number, wind: number }> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/misc/weather`;

        const qParams = new HttpParams()
            .set("lat", coords.lat.toString())
            .set("lon", coords.lng.toString());

        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        return res.data;

    }


    /** Sends a new observation to the server. */
    async postObservation(): Promise<void> {

        const cleanObs = this.cleanObservationFields();

        if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline)
            await this.offlineService.storeObservation(cleanObs);
        else
            await this.sendObservation(cleanObs);

    }


    async postStoredObservations(): Promise<void> {

        // ToDo check if offline

        const savedObs = await this.offlineService.getStoredObservations();

        console.log(savedObs);

        if (!savedObs) return;

        const pObs: Array<Promise<void>> = [];

        savedObs.forEach((obs, i) => {

            console.log(obs);

            pObs.push(
                this.sendObservation(obs)
                    .then(() => console.log(i + " done"))
                    .catch(() => console.log(i + " err"))
            );

        });

        await Promise.all(pObs);

        console.log(await this.offlineService.getStoredObservations());

    }


    private cleanObservationFields(): any {

        const obs = cloneDeep(this.newObservation);

        // @ts-ignore
        obs.position.coordinates = [obs.position.coordinates.lng, obs.position.coordinates.lat];

        Object.keys(obs.details).forEach(k => {

            if (!obs.details[k].checked) {
                delete obs.details[k];
                return;
            }

            delete obs.details[k].component;

            if (k === "odours" && obs.details[k].origin.length === 0) obs.details[k].origin = undefined;
            if (k === "litters" && obs.details[k].type.length === 0) obs.details[k].type = undefined;

            if (k === "fauna") {

                Object.keys(obs.details.fauna).forEach(f => {
                    if (obs.details.fauna[f].alien && obs.details.fauna[f].alien.species.length === 0)
                        obs.details.fauna[f].alien.species = undefined
                });

            }

        });

        if (Object.keys(obs.details).length === 0) delete obs.details;

        if (obs.measures) {

            Object.keys(obs.measures).forEach(k => {

                if (!obs.measures[k].checked) {
                    delete obs.measures[k];
                    return;
                }

                delete obs.measures[k].checked;
                delete obs.measures[k].component;

            });

        }

        return obs;

    }


    async sendObservation(obs: any): Promise<void> {

        const formData = await this.setRequestBody(obs);

        formData.forEach(f => console.log(f));

        // const url     = `${ environment.apiBaseUrl }/${ environment.apiVersion }/observations/`;
        // const qParams = new HttpParams().set("minimalRes", "true");
        //
        // const res = await this.http.post<GenericApiResponse>(url, formData, { params: qParams }).toPromise();
        //
        // const resData = <MinimalObservation>res.data;
        //
        // if (resData.position.roi)
        //     this._obs.next([...this._obs.value, resData]);

    }


    private async setRequestBody(obs: any): Promise<FormData> {

        const formData = new FormData();

        for (let i = 0; i < obs.photos.length; i++) {
            if (obs.photos[i])
                await this.appendImage(formData, obs.photos[i], "photos");
        }

        delete obs.photos;

        if (get(obs, "details.outlets.signagePhoto")) {
            await this.appendImage(formData, obs.details.outlets.signagePhoto, "signage");
            obs.details.outlets.signagePhoto = undefined;
        }

        Object.keys(obs).forEach(k => formData.append(k, JSON.stringify(obs[k])));

        return formData;

    }


    /**
     * Appends an image to a given formData.
     *
     * @param {FormData} formData - The formData.
     * @param {string} url - The url of the photo.
     * @param {string} field - The name of the field.
     */
    private appendImage(formData: FormData, url: string, field: string): Promise<void> {

        return new Promise((resolve, reject) => {

            this.file.resolveLocalFilesystemUrl(url)
                .then((entry: FileEntry) => {

                    entry.file(file => {

                        const reader = new FileReader();

                        reader.onloadend = () => {
                            const imgBlob = new Blob([reader.result], { type: "image/jpeg" });
                            formData.append(field, imgBlob, file.name);
                            resolve()
                        };

                        reader.onerror = err => reject(err);

                        reader.readAsArrayBuffer(file);

                    }, err => reject(err));

                })
                .catch(err => reject(err));
        });

    }


    /** Sets the new observation to null. */
    resetNewObservation(): void { this.newObservation = null }

}
