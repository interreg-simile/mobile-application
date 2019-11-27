import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SurveysService } from "../surveys.service";
import { questionInterface, QuestionType, Survey } from "../survey.model";
import { IonSlide, IonSlides, NavController } from "@ionic/angular";

@Component({
    selector   : 'app-survey',
    templateUrl: './survey.page.html',
    styleUrls  : ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {

    // ToDo temp
    survey: Survey = new Survey(
        "5ddbd85b0b802181a4706935",
        "Test survey",
        "7 minuti",
        "-",
        null,
        [
            { position: 1, body: "Question 1", type: QuestionType.freeText },
            {
                position: 2,
                body    : "Question 2",
                type    : QuestionType.singleAnswer,
                answers : [
                    { position: 1, body: "Answer 1" },
                    { position: 2, body: "Answer 2" },
                    { position: 3, body: "Answer 3" },
                    { position: 4, body: "Answer 4" },
                    { position: 5, body: "Answer 5" },
                ]
            }
        ]
    );

    @ViewChild("slider", { read: IonSlides, static: false }) slider: IonSlides;

    private slideOpts = { allowTouchMove: false };
    private currIdx   = 0;

    QuestionType = QuestionType;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private surveysService: SurveysService
    ) { }

    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            if (!params.has("surveyId")) {
                this.navCtrl.navigateBack("/surveys");
                return;
            }

            // ToDo temp
            // this.survey = this.surveysService.getById(params.get("surveyId"));

        });

        // this.onStart();

    }

    onBackClicked() { this.navCtrl.navigateBack("/surveys") }

    onStart() { this.currIdx = 1 }

    next() {
        this.slider.slideNext();
    }

    onSlidesLoaded() { }

    onNext(pos) {

        if (pos < this.survey.questions.length) {
            this.currIdx++;
            this.slider.slideNext();
        } else
            console.log("End")
    }

    onBack() {
        this.currIdx--;
        this.slider.slidePrev();
    }

}
