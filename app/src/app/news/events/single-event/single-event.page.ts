import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { Event } from "../event.model";
import { NewsService } from "../../news.service";
import { NGXLogger } from "ngx-logger";

@Component({
  selector: "app-single-event",
  templateUrl: "./single-event.page.html",
  styleUrls: ["./single-event.page.scss"],
})
export class SingleEventPage implements OnInit {
  public event: Event;
  public locale: string;

  constructor(
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute,
    private navCtr: NavController,
    private i18n: TranslateService,
    private logger: NGXLogger,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.locale = this.i18n.currentLang;

    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!id) this.navCtr.back();

    this.event = this.newsService.getEventById(id);
    if (!this.event) this.navCtr.back();

    this.newsService
      .saveData(this.newsService.storageKeyEvents, this.event.id)
      .then(() => {
        this.event.read = true;
        return this.newsService.checkNewEvents();
      })
      .catch((err) => this.logger.error("Error saving the read event.", err));
  }

  /** Fired when the user clicks to get the directions for the event. */
  onDirectionsClick(): void {
    const coords = `${this.event.coordinates.lat},${this.event.coordinates.lng}`;
    const label = encodeURI(this.event.title);

    if (this.platform.is("ios")) window.open(`maps://?q=${coords}_system`);
    else window.open(`geo:0,0?q=${coords}(${label})_system`);
  }
}
