import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";


@Component({ selector: 'app-info', templateUrl: './info.page.html', styleUrls: ['./info.page.scss'] })
export class InfoPage implements OnInit {


    /** @ignore */
    constructor(private activatedRoute: ActivatedRoute, private navCtr: NavController) { }


    /** @ignore */
    ngOnInit() {

        const id = this.activatedRoute.snapshot.paramMap.get("id");

        if (!id) this.navCtr.back();

        console.log(id);

    }


    // ToDo
    onDeleteClick() { }


}
