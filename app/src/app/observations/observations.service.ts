import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import {NGXLogger} from 'ngx-logger';
import {LatLng} from 'leaflet';

import {environment} from '../../environments/environment';
import {GenericApiResponse} from '../shared/utils.interface';
import {Observation} from './observation.model';
import {ObsInfo} from './info/obs-info.model';
import {ConnectionStatus, NetworkService} from '../shared/network.service';
import {OfflineService} from './offline.service';
import {FileService} from '../shared/file.service';

export interface MinimalObservation {
  _id: string;
  uid: string;
  callId?: number;
  position: {
    coordinates: Array<number>;
    roi?: string;
    area?: number;
  };
}

@Injectable({providedIn: 'root'})
export class ObservationsService {
  private _obs = new BehaviorSubject<Array<MinimalObservation>>([]);

  public newObservation: Observation;

  get observations() {
    return this._obs.asObservable();
  }

  constructor(
    private http: HttpClient,
    private fileService: FileService,
    private networkService: NetworkService,
    private logger: NGXLogger,
    private offlineService: OfflineService
  ) {
  }

  async fetchObservations(): Promise<void> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/observations`;

    const qParams = new HttpParams()
      .set('minimalRes', 'true')
      .set('excludeOutOfRois', 'true');

    const res = await this.http
      .get<GenericApiResponse>(url, {params: qParams})
      .toPromise();

    this._obs.next(res.data);
  }

  async getObservationById(id: string): Promise<ObsInfo> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/observations/${id}`;

    const res = await this.http.get<GenericApiResponse>(url).toPromise();

    const data = res.data as ObsInfo;

    data.photos = data.photos.map((p) => `${environment.apiBaseUrl}/${p}`);

    if (get(data, 'details.outlets.signagePhoto')) {
      data.details.outlets.signagePhoto = `${environment.apiBaseUrl}/${data.details.outlets.signagePhoto}`;
    }

    return data;
  }

  async getWeatherData(
    coords: LatLng
  ): Promise<{ sky: number; temperature: number; wind: number }> {
    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/misc/weather`;

    const qParams = new HttpParams()
      .set('lat', coords.lat.toString())
      .set('lon', coords.lng.toString());

    const res = await this.http
      .get<GenericApiResponse>(url, {params: qParams})
      .toPromise();

    return res.data;
  }

  async postObservation(): Promise<'online' | 'offline'> {
    console.log(this.newObservation);

    const cleanObs = this.cleanObservationFields();

    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      await this.offlineService.storeObservation(cleanObs);
      return 'offline';
    } else {
      await this.sendObservation(cleanObs);
      return 'online';
    }
  }

  async postObservationWithCall(): Promise<MinimalObservation> {
    const cleanObs = this.cleanObservationFields();

    return this.sendObservation(cleanObs, true);
  }

  async postStoredObservations(): Promise<void> {
    const savedObs = await this.offlineService.getStoredObservations();

    if (!savedObs || savedObs.length === 0) {
      return;
    }

    const pObs = [];
    const errObs = [];

    savedObs.forEach((obs) => {
      pObs.push(
        this.sendObservation(obs)
          .then(() => {
            this.logger.log('Observation correctly sent');
            this.removeStoredObservationImages(obs);
          })
          .catch((err) => {
            this.logger.error('Error sending observation.', err);
            errObs.push(obs);
          })
      );
    });

    await Promise.all(pObs);

    await this.offlineService.storeObservations(errObs);
  }

  private cleanObservationFields(): any {
    const obs = cloneDeep(this.newObservation) as any;

    obs.position.coordinates = [
      obs.position.coordinates.lng,
      obs.position.coordinates.lat,
    ];

    Object.keys(obs.details).forEach((k) => {
      if (!obs.details[k].checked) {
        delete obs.details[k];
        return;
      }

      delete obs.details[k].component;

      if (k === 'odours' && obs.details[k].origin.length === 0) {
        obs.details[k].origin = undefined;
      }
      if (k === 'litters' && obs.details[k].type.length === 0) {
        obs.details[k].type = undefined;
      }

      if (k === 'fauna') {
        Object.keys(obs.details.fauna).forEach((f) => {
          if (
            obs.details.fauna[f].alien &&
            obs.details.fauna[f].alien.species.length === 0
          ) {
            obs.details.fauna[f].alien.species = undefined;
          }
        });
      }
    });

    if (Object.keys(obs.details).length === 0) {
      delete obs.details;
    }

    if (obs.measures) {
      if (!obs.measures.checked) {
        delete obs.measures;
      } else {
        Object.keys(obs.measures).forEach((k) => {
          if (!obs.measures[k].checked) {
            delete obs.measures[k];
            return;
          }

          delete obs.measures[k].checked;
          delete obs.measures[k].component;
        });
      }
    }

    return obs;
  }

  private async sendObservation(
    obs: any,
    generateCallId: boolean = false
  ): Promise<MinimalObservation> {
    const formData = await this.setRequestBody(obs);

    const url = `${environment.apiBaseUrl}/${environment.apiVersion}/observations`;
    const qParams = new HttpParams()
      .set('minimalRes', 'true')
      .set('callId', String(generateCallId));

    const res = await this.http
      .post<GenericApiResponse>(url, formData, {params: qParams})
      .toPromise();

    const resData = res.data as MinimalObservation;

    if (resData.position.roi) {
      this._obs.next([...this._obs.value, resData]);
    }

    return resData;
  }

  private async setRequestBody(obs: any): Promise<FormData> {
    const formData = new FormData();

    for (let i = 0; i < obs.photos.length; i++) {
      if (obs.photos[i]) {
        await this.fileService
          .appendImage(formData, obs.photos[i], 'photos')
          .catch((err) =>
            this.logger.error(`Error appending photo ${obs.photos[i]}.`, err)
          );
      }
    }

    const outletPhoto = get(obs, 'details.outlets.signagePhoto');

    if (outletPhoto) {
      await this.fileService
        .appendImage(formData, obs.details.outlets.signagePhoto, 'signage')
        .catch((err) =>
          this.logger.error('Error appending signage photo.', err)
        );

      obs.details.outlets.signagePhoto = undefined;
    }

    Object.keys(obs).forEach((k) => {
      if (k === 'photos') {
        return;
      }
      formData.append(k, JSON.stringify(obs[k]));
    });

    if (outletPhoto) {
      obs.details.outlets.signagePhoto = outletPhoto;
    }

    return formData;
  }

  async removeStoredObservationImages(obs: any): Promise<void> {
    for (let i = 0; i < obs.photos.length; i++) {
      if (obs.photos[i]) {
        await this.fileService
          .removeImage(obs.photos[i])
          .catch((err) =>
            this.logger.error(`Error removing image ${obs.photos[i]}`, err)
          );
      }
    }

    const outletPhoto = get(obs, 'details.outlets.signagePhoto');

    if (outletPhoto) {
      await this.fileService
        .removeImage(outletPhoto)
        .catch((err) =>
          this.logger.error(`Error removing image ${outletPhoto}`, err)
        );
    }
  }

  resetNewObservation(): void {
    this.newObservation = null;
  }
}
