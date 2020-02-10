import { Component, OnInit } from '@angular/core';

@Component({
    selector   : 'app-new-observation',
    templateUrl: './new-observation.page.html',
    styleUrls  : ['./new-observation.page.scss']
})
export class NewObservationPage implements OnInit {


    private detailsList = ["algae", "foams", "oils", "litters", "odours", "outlets", "fauna"];


    constructor() { }

    ngOnInit() {
    }

}
