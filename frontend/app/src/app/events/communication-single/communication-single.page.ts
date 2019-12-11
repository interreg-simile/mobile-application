import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Communication } from "../communication.model";
import { EventsService } from "../events.service";

@Component({
    selector   : 'app-communication-single',
    templateUrl: './communication-single.page.html',
    styleUrls  : ['./communication-single.page.scss'],
})
export class CommunicationSinglePage implements OnInit {


    public communication: Communication;


    /** @ignore */
    constructor(private route: ActivatedRoute, private navCtrl: NavController, private eventsService: EventsService) { }


    /** @ignore */
    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            if (!params.has("id")) {
                this.navCtrl.navigateBack("/events");
                return;
            }

            this.communication = this.eventsService.getCommunicationById(params.get("id"));

            if (!this.communication) {
                this.navCtrl.navigateBack("/events",);
                return;
            }

            this.eventsService.addReadCommunication(this.communication.id)
                .then(() => this.communication.read = true)
                .catch(err => console.error(err));

        });

    }

}
