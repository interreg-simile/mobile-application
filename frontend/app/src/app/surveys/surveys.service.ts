import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { HttpService } from "../shared/http.service";
import { environment } from "../../environments/environment";
import { Survey } from "./survey.model";

@Injectable({
    providedIn: 'root'
})
export class SurveysService {

    private _surveys = new BehaviorSubject<Survey[]>([]);

    constructor(private http: HttpService) { }

    get surveys() { return this._surveys.asObservable() }

    getAll() {

        return this.http
            .get(`${ environment.apiUrl }/surveys/?expired=false&answers=all`)
            .pipe(
                map(resData => {

                    const surveys = [];

                    for (const survey of resData.data.surveys) {

                        surveys.push(new Survey(
                            survey._id,
                            survey.title,
                            survey.etc,
                            survey.area
                        ));

                    }

                    return surveys;

                }),
                tap(surveys => this._surveys.next(surveys))
            );

    }

}
