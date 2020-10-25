import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ObservationsService} from '../../observations.service';
import {CameraService, PicResult} from '../../../shared/camera.service';
import {Duration, ToastService} from '../../../shared/toast.service';
import {PhotoViewerComponent} from '../../../shared/photo-viewer/photo-viewer.component';

interface Props {
  inPlace?: boolean;
  terminal?: number;
  colour?: number;
  vapour?: boolean;
  signage?: boolean;
  signagePhoto?: string;
  prodActNearby?: boolean;
  prodActNearbyDetails?: string;
}

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.component.html',
  styleUrls: ['./outlets.component.scss'],
})
export class OutletsComponent implements OnInit {
  public _props: Props = {};

  public _colours = {
    1: {selected: false, colour: '#D64818'},
    2: {selected: false, colour: '#1060B0'},
    3: {selected: false, colour: '#1F7F16'},
    4: {selected: false, colour: '#888888'},
    5: {selected: false, colour: '#6C4B11'},
    6: {selected: false, colour: '#D7B427'},
    7: {selected: false, colour: '#FFFFFF'},
  };

  _originalOrder = (a, b) => 0;

  constructor(
    private modalCtr: ModalController,
    private obsService: ObservationsService,
    private cameraService: CameraService,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this._props.inPlace = this.obsService.newObservation.details.outlets.inPlace;
    this._props.terminal = this.obsService.newObservation.details.outlets.terminal.code;
    this._props.colour = this.obsService.newObservation.details.outlets.colour.code;
    this._props.vapour = this.obsService.newObservation.details.outlets.vapour;
    this._props.signage = this.obsService.newObservation.details.outlets.signage;
    this._props.signagePhoto = this.obsService.newObservation.details.outlets.signagePhoto;
    this._props.prodActNearby = this.obsService.newObservation.details.outlets.prodActNearby;
    this._props.prodActNearbyDetails = this.obsService.newObservation.details.outlets.prodActNearbyDetails;

    if (this._props.colour) {
      this._colours[this._props.colour].selected = true;
    }
  }

  onColourClick(colour: any): void {
    this._props.colour = undefined;

    Object.keys(this._colours).forEach((c) => {
      if (
        c !== colour.key ||
        (c === colour.key && this._colours[colour.key].selected)
      ) {
        this._colours[c].selected = false;
        return;
      }

      this._colours[c].selected = true;
      this._props.colour = parseInt(colour.key);
    });
  }

  async onSignagePhotoClick(): Promise<void> {
    if (this._props.signagePhoto) {
      const src = this.cameraService.getImgSrc(this._props.signagePhoto);

      const modal = await this.modalCtr.create({
        component: PhotoViewerComponent,
        componentProps: {src, edit: true, delete: true},
      });

      await modal.present();

      const data = (await modal.onDidDismiss()).data;

      if (!data) {
        return;
      }

      if (data.delete) {
        this._props.signagePhoto = undefined;
        return;
      }
    }

    await this.takePicture();
  }

  async takePicture(): Promise<void> {
    const pic = await this.cameraService.takePicture();

    if (pic === PicResult.NO_IMAGE) {
      return;
    }

    if (pic === PicResult.ERROR) {
      await this.toastService.presentToast(
        'common.errors.photo',
        Duration.short
      );
    } else {
      this._props.signagePhoto = pic;
    }
  }

  async closeModal(save: boolean): Promise<void> {
    if (save) {
      this.obsService.newObservation.details.outlets.checked = true;
      this.obsService.newObservation.details.outlets.inPlace = this._props.inPlace;
      this.obsService.newObservation.details.outlets.terminal.code = this._props.terminal;
      this.obsService.newObservation.details.outlets.colour.code = this._props
        .inPlace
        ? this._props.colour
        : undefined;
      this.obsService.newObservation.details.outlets.vapour = this._props.vapour;
      this.obsService.newObservation.details.outlets.signage = this._props.signage;
      this.obsService.newObservation.details.outlets.signagePhoto = this._props
        .signage
        ? this._props.signagePhoto
        : undefined;
      this.obsService.newObservation.details.outlets.prodActNearby = this._props.prodActNearby;
      this.obsService.newObservation.details.outlets.prodActNearbyDetails = this
        ._props.prodActNearby
        ? this._props.prodActNearbyDetails
        : undefined;
    }

    await this.modalCtr.dismiss();
  }
}
