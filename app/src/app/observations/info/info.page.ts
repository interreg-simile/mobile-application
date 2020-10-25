import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import set from 'lodash-es/set';
import get from 'lodash-es/get';
import {TranslateService} from '@ngx-translate/core';

import {ObservationsService} from '../observations.service';
import {Duration, ToastService} from '../../shared/toast.service';
import {ObsInfo} from './obs-info.model';
import {DomSanitizer} from '@angular/platform-browser';
import {PhotoViewerComponent} from '../../shared/photo-viewer/photo-viewer.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  public _isLoading: boolean;
  public _obs: ObsInfo;
  public _userId: string;

  public objKeys = Object.keys;

  originalOrder = (a, b) => 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtr: NavController,
    private obsService: ObservationsService,
    private toastService: ToastService,
    public i18n: TranslateService,
    public domSanitizer: DomSanitizer,
    public modalCtr: ModalController
  ) {
  }

  ngOnInit() {
    this._isLoading = true;

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.navCtr.back();
    }

    this.obsService
      .getObservationById(id)
      .then((obs) => {
        this._obs = obs;
        this._isLoading = false;
      })
      .catch((err) => {
        console.error(err);
        this.toastService.presentToast('page-info-obs.err-get', Duration.short);
        this.navCtr.back();
      });
  }

  onToggleClick(prop: string): void {
    if (prop === 'otherOpen') {
      this._obs.otherOpen = !this._obs.otherOpen;
      return;
    }

    set(this._obs, `${prop}.open`, !get(this._obs, `${prop}.open`));
  }

  hasDetailProperties(detailPath: string): boolean {
    const prop = get(this._obs, detailPath);

    return Object.keys(prop).some((k) => k !== 'checked');
  }

  async onThumbnailClick(src: string): Promise<void> {
    const modal = await this.modalCtr.create({
      component: PhotoViewerComponent,
      componentProps: {src, edit: false, delete: false, download: true},
    });

    await modal.present();
  }
}
