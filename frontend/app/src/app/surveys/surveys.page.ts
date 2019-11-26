import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

import { Survey } from "./survey.model";
import { SurveyData, SurveysService } from "./surveys.service";
import { TranslateService } from "@ngx-translate/core";

@Component({ selector: 'app-surveys', templateUrl: './surveys.page.html', styleUrls: ['./surveys.page.scss'] })
export class SurveysPage implements OnInit, OnDestroy {

    /** Surveys done and not done by the user. */
    surveys: SurveyData = { newSurveys: [], doneSurveys: [] };

    /** @ignore */
    private _surveysSub: Subscription;

    /** True if the page is waiting for data from the server. */
    isLoading = false;

    /** The current locale of the application. */
    locale: string;


    /** @ignore */
    constructor(private surveysService: SurveysService, private i18n: TranslateService) { }


    ngOnInit() {

        this._surveysSub = this.surveysService.surveys.subscribe(surveys => this.surveys = surveys);

        // Retrieve the current locale.
        this.locale = this.i18n.currentLang;

    }

    ionViewWillEnter() {

        this.isLoading = true;

        this.surveysService.getAll().subscribe(() => this.isLoading = false);

    }

    onSurveyClick(survey) {

        console.log(survey);

    }

    ngOnDestroy() {

        if (this._surveysSub) this._surveysSub.unsubscribe();

    }

    onRefresh($event) { this.surveysService.getAll().subscribe(() => $event.target.complete()) }
}
