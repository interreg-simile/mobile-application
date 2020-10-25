import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

import {Event} from './event.model';
import {NetworkService} from '../../shared/network.service';
import {Alert} from '../alerts/alert.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  @Input() events: Event[];

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

  async onEventClick(event: Event): Promise<void> {
    if (this.networkService.checkOnlineContentAvailability()) {
      await this.router.navigate(['/', 'news', 'events', event.id]);
    }
  }
}
