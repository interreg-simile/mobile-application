import { Component, OnInit } from '@angular/core';

import { NewsService } from "../../news.service";


@Component({ selector: 'app-filter', templateUrl: './filter.component.html', styleUrls: ['./filter.component.scss'] })
export class FilterComponent implements OnInit {


    /** Possible regions of interest. */
    public rKeys = Object.keys(this.newsService.newRois);


    /** @ignore */
    constructor(private newsService: NewsService) { }

    /** @ignore */
    ngOnInit() { }


    onCheckboxChange(e) {

        // ToDo at least one checked

    }

}
