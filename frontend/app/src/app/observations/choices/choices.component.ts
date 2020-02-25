import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";


/** Possible choices. */
export enum Choices {
    NO_ACTION,
    SEND,
    ADD_MEASURE,
    CALL_AUTH
}


@Component({
    selector   : 'app-choices',
    templateUrl: './choices.component.html',
    styleUrls  : ['./choices.component.scss']
})
export class ChoicesComponent implements OnInit {


    public _choices = Choices;


    /** @ignore */
    constructor(private modalCrt: ModalController) { }


    /** @ignore */
    ngOnInit() {}


    /**
     * Closes the modal and send back the data related to the user choice.
     *
     * @param {Choices} choice - The user choice.
     * @return {Promise<>} An empty promise.
     */
    async closeModal(choice: Choices): Promise<void> { await this.modalCrt.dismiss(choice) }


}
