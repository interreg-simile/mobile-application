import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

@Component({
    selector   : 'app-choices',
    templateUrl: './choices.component.html',
    styleUrls  : ['./choices.component.scss']
})
export class ChoicesComponent implements OnInit {


    private _msgParam = {company: "Arpa Lombardia"};


    /** @ignore */
    constructor(private modalCrt: ModalController) { }


    /** @ignore */
    ngOnInit() {}


    async closeModal() { await this.modalCrt.dismiss() }

}
