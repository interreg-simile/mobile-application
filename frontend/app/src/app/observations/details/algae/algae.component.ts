import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";

@Component({ selector: 'app-algae', templateUrl: './algae.component.html', styleUrls: ['./algae.component.scss'] })
export class AlgaeComponent implements OnInit {


    constructor(private modalCtr: ModalController) { }


    ngOnInit() {}


    onHelpClick() {

    }


    async closeModal() {

        await this.modalCtr.dismiss();

    }

}
