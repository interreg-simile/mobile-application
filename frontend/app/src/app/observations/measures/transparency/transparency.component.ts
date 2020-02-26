import { Component, OnInit } from '@angular/core';

@Component({
    selector   : 'app-transparency',
    templateUrl: './transparency.component.html',
    styleUrls  : ['./transparency.component.scss'],
})
export class TransparencyComponent implements OnInit {


    public props;


    constructor() { }

    ngOnInit() {

        console.log(this.props);

    }

}
