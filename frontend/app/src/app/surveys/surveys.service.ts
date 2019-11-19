import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Survey } from "./survey.model";

@Injectable({
    providedIn: 'root'
})
export class SurveysService {

    private _surveys = new BehaviorSubject<Survey[]>([]);

    constructor(private http: HttpClient) { }

    get surveys() { return this._surveys.asObservable() }

    getAll() {

        return this.http
            .get<[any]>(`${ environment.apiUrl }/surveys/?expired=false`)
            .pipe(
                map(resData => {

                    const surveys = [];

                    for (const survey of resData) {

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
