import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';

import {Duration, ToastService} from './toast.service';

export enum ConnectionStatus {
  Online,
  Offline,
}

@Injectable({providedIn: 'root'})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(
    ConnectionStatus.Offline
  );

  constructor(
    private network: Network,
    private logger: NGXLogger,
    private toastService: ToastService
  ) {
  }

  init(): void {
    this.initializeNetworkEvents();

    const status =
      this.network.type !== 'none'
        ? ConnectionStatus.Online
        : ConnectionStatus.Offline;

    this.status.next(status);
  }

  private initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        this.logger.log('App offline.');
        this.status.next(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        this.logger.log('App online');
        this.status.next(ConnectionStatus.Online);
      }
    });
  }

  onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  checkOnlineContentAvailability(): boolean {
    if (this.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      this.toastService.presentToast('common.errors.offline', Duration.short);
      return false;
    }

    return true;
  }

  getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
