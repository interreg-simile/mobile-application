import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, forkJoin } from "rxjs";
import { map, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Survey } from "./survey.model";
import { AuthService } from "../auth/auth.service";
import { genericApiResponse } from "../shared/utils.interface";


export interface SurveyData {
    newSurveys: Survey[],
    doneSurveys: Survey[]
}

/** Handles the logic behind the communication with the API with regard to the surveys. */
@Injectable({ providedIn: "root" })
export class SurveysService {

    /** @ignore */
    private _surveys = new BehaviorSubject<SurveyData>({ newSurveys: [], doneSurveys: [] });

    private newSurveys: Survey[] = [];


    /** @ignore */
    constructor(private http: HttpClient, private auth: AuthService) { }


    /**
     * Returns the surveys as an observable.
     *
     * @return Observable<SurveyData> The surveys.
     */
    get surveys() { return this._surveys.asObservable() }


    /**
     * Fetches the surveys done and not yet done by the user.
     *
     * @return Observable<SurveyData> - An observable containing the surveys.
     */
    getAll() {

        // Save the url of the requests
        const url = `${ environment.apiUrl }/surveys/user/${ this.auth.userId }`;

        // Retrieve both the surveys done and not done by the user
        const newSurveys  = this.http.get<genericApiResponse>(`${ url }?includeExpired=false&invert=true`);
        const doneSurveys = this.http.get<genericApiResponse>(url);

        // Wait for the two requests to complete
        return forkJoin([newSurveys, doneSurveys]).pipe(
            map(data => {

                console.log(data);

                // Initialize the surveys object
                const surveys = { newSurveys: [], doneSurveys: [] };

                // Save all the new surveys
                for (const s of data[0].data.surveys)
                    surveys.newSurveys.push(new Survey(s._id, s.title, s.etc, s.area, s.expireDate, s.questions));

                // Save all the done surveys
                for (const s of data[1].data.surveys)
                    surveys.doneSurveys.push(new Survey(s._id, s.title, s.etc, s.area, null, null, s.usersAnswers[0].date));

                this.newSurveys = surveys.newSurveys;

                // Return the surveys
                return surveys;

            }),
            tap(surveys => this._surveys.next(surveys))
        );

    }


    getById(id: string) { return this.newSurveys.find(s => s.id === id) }

}
