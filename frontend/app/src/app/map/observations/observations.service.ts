import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { GenericApiResponse } from "../../shared/utils.interface";


/**
 * Service to handle the observations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Injectable({ providedIn: 'root' })
export class ObservationsService {


    /** @ignore */ private _obs = new BehaviorSubject<any[]>([]);


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

}
