import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { HttpService } from "../shared/http.service";
import { environment } from "../../environments/environment";
import { Survey } from "./survey.model";
import { AuthService } from "../auth/auth.service";


interface SurveyData {
    new: Survey[];
    completed: Survey[];
}

@Injectable({
    providedIn: 'root'
})
export class SurveysService {

    private _surveys = new BehaviorSubject<SurveyData>({ new: [], completed: [] });

    constructor(private http: HttpService, private auth: AuthService) { }

    get surveys() { return this._surveys.asObservable() }

    // getAll() {
    //
    //     const s: SurveyData = { new: [], completed: [] };
    //
    //     return this.http
    //         .get(`${ environment.apiUrl }/surveys/user/${ this.auth.userId }?includeExpired=false&invert=true`)
    //         .pipe(
    //             map(resData => {
    //
    //                 const surveys = [];
    //
    //                 for (const survey of resData.data.surveys) {
    //
    //                     surveys.push(new Survey(
    //                         survey._id,
    //                         survey.title,
    //                         survey.etc,
    //                         survey.area
    //                     ));
    //
    //                 }
    //
    //                 s.new = surveys;
    //
    //                 // return surveys;
    //
    //             }),
    //
    //             // tap(surveys => this._surveys.next(surveys))
    //         );
    //
    // }

    getAll(): Promise<SurveyData> {

        const s: SurveyData = { new: [], completed: [] };

        const baseUrl = `${ environment.apiUrl }/surveys/user/${ this.auth.userId }?includeExpired=false&invert=`;

        return this.http.get(`${ baseUrl }=true`).toPromise()
            .then((resData: any) => {

                const surveys = [];

                for (const survey of resData.data.surveys) {

                    surveys.push(new Survey(
                        survey._id,
                        survey.title,
                        survey.etc,
                        survey.area
                    ));

                }

                s.new = surveys;

                return this.http.get(`${ baseUrl }=false`).toPromise();

            })
            .then((resData: any) => {

                const surveys = [];

                for (const survey of resData.data.surveys) {

                    surveys.push(new Survey(
                        survey._id,
                        survey.title,
                        survey.etc,
                        survey.area
                    ));

                }

                s.completed = surveys;

                return s;

            })
            // .then((s: SurveyData) => this._surveys.next(s))
            // .catch(err => console.error(err))

    }


}
