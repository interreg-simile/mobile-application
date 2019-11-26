import { Component, Input } from '@angular/core';

import { Survey } from "../survey.model";

@Component({
    selector   : 'app-survey-item',
    templateUrl: './survey-item.component.html',
    styleUrls  : ['./survey-item.component.scss']
})
export class SurveyItemComponent {

    /** The survey object to visualize. */
    @Input() survey: Survey;

    /** The current locale. */
    @Input() locale: string;


    /** @ignore */
    constructor() {}

}
