import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { NGXLogger } from "ngx-logger";

import { Alert } from "../alert.model";
import { NewsService } from "../../news.service";

@Component({
  selector: "app-single-alert",
  templateUrl: "./single-alert.page.html",
  styleUrls: ["./single-alert.page.scss"],
})
export class SingleAlertPage implements OnInit {
  public alert: Alert;
  public locale: string;

  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private navCtr: NavController,
    private i18n: TranslateService,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.locale = this.i18n.currentLang;

    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!id) this.navCtr.back();

    this.alert = this.newsService.getAlertById(id);
    if (!this.alert) this.navCtr.back();

    this.newsService
      .saveData(this.newsService.storageKeyAlerts, this.alert.id)
      .then(() => {
        this.alert.read = true;
        return this.newsService.checkNewAlerts();
      })
      .catch((err) => this.logger.error("Error saving the read alert.", err));
  }
}
