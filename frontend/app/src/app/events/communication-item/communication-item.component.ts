import { Component, Input } from '@angular/core';
import { Communication } from "../communication.model";


@Component({
    selector   : 'app-communication-item',
    templateUrl: './communication-item.component.html',
    styleUrls  : ['./communication-item.component.scss'],
})
export class CommunicationItemComponent {

    /** Communication object displayed by the component. */
    @Input() item: Communication;


    /** @ignore */
    constructor() { }

}
