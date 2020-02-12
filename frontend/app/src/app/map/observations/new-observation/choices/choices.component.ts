import { Component, OnInit } from '@angular/core';

@Component({
    selector   : 'app-choices',
    templateUrl: './choices.component.html',
    styleUrls  : ['./choices.component.scss']
})
export class ChoicesComponent implements OnInit {


    private _msgParam = {company: "Arpa Lombardia"};


    /** @ignore */
    constructor() { }


    /** @ignore */
    ngOnInit() {}

}
