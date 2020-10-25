import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {DomSanitizer} from '@angular/platform-browser';
import {Base64ToGallery} from '@ionic-native/base64-to-gallery/ngx';

import {statusBarColor} from '../../app.component';
import {FileService} from '../file.service';
import {TranslateService} from '@ngx-translate/core';
import {Duration, ToastService} from '../toast.service';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss'],
})
export class PhotoViewerComponent implements OnInit {
  public src: string;
  public delete: boolean;
  public edit: boolean;

  public slideOpts = {zoom: {maxRation: 2}};

  constructor(
    private logger: NGXLogger,
    private modalCtrl: ModalController,
    private statusBar: StatusBar,
    public sanitizer: DomSanitizer,
    private fileService: FileService,
    private base64ToGallery: Base64ToGallery,
    private i18n: TranslateService,
    private loadingCtr: LoadingController,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.statusBar.backgroundColorByHexString('#000000');
  }

  async onCLoseClick(): Promise<void> {
    await this.dismiss();
  }

  async onEditClick(): Promise<void> {
    await this.dismiss({edit: true});
  }

  async onDeleteClick(): Promise<void> {
    await this.dismiss({delete: true});
  }

  async dismiss(data?): Promise<void> {
    this.statusBar.backgroundColorByHexString(statusBarColor);

    await this.modalCtrl.dismiss(data);
  }
}
