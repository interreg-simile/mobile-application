import { Component, Input } from '@angular/core';
import { Survey } from "../survey.model";

@Component({
    selector   : 'app-survey-item',
    templateUrl: './survey-item.component.html',
    styleUrls  : ['./survey-item.component.scss'],
})
export class SurveyItemComponent {

    @Input() survey: Survey;

    constructor() { }

}
