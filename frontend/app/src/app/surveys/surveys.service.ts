import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Survey } from "./survey.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SurveysService {

    private _surveys = new BehaviorSubject<Survey[]>([]);

    constructor(private http: HttpClient) { }

    get surveys() { return this._surveys.asObservable() }

    getAll() {



    }

}
