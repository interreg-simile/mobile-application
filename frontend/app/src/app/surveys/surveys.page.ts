import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { Survey } from "./survey.model";
import { SurveysService } from "./surveys.service";

@Component({
    selector   : 'app-surveys',
    templateUrl: './surveys.page.html',
    styleUrls  : ['./surveys.page.scss'],
})
export class SurveysPage implements OnInit, OnDestroy {

    surveys: Survey[];
    private _surveysSub: Subscription;

    isLoading = false;

    constructor(private surveysService: SurveysService) { }

    ngOnInit() {

        this._surveysSub = this.surveysService.surveys.subscribe(surveys => this.surveys = surveys);

    }

    ionViewWillEnter() {

        this.isLoading = true;

        setTimeout(() => this.isLoading = false, 3000);

    }

    onSurveyClick() {

        console.log("Survey clicked");

    }

    ngOnDestroy() {

        if (this._surveysSub) this._surveysSub.unsubscribe();

    }

}
