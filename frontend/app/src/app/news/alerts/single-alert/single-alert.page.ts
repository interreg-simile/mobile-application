import { Component, OnInit } from '@angular/core';
import { Alert } from "../alert.model";
import { NewsService } from "../../news.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
    selector   : 'app-single-alert',
    templateUrl: './single-alert.page.html',
    styleUrls  : ['./single-alert.page.scss']
})
export class SingleAlertPage implements OnInit {


    public alert: Alert;


    /** @ignore */
    constructor(private newsService: NewsService, private route: ActivatedRoute, private navCtrl: NavController) { }


    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            if (!params.has("id")) {
                this.navCtrl.navigateBack("/news");
                return;
            }

            this.alert = this.newsService.getAlertById(params.get("id"));

            if (!this.alert) {
                this.navCtrl.navigateBack("/news",);
                return;
            }

            this.newsService.addReadAlert(this.alert.id)
                .then(() => this.alert.read = true)
                .catch(err => console.error(err));

        });

    }

}
