import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

import {Alert} from './alert.model';
import {NetworkService} from '../../shared/network.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {
  @Input() alerts: Alert[];

  public locale: string;

  constructor(
    private i18n: TranslateService,
    private networkService: NetworkService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.locale = this.i18n.currentLang;
  }

  async onAlertClick(alert: Alert): Promise<void> {
    if (this.networkService.checkOnlineContentAvailability()) {
      await this.router.navigate(['/', 'news', 'alerts', alert.id]);
    }
  }
}
