import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { BehaviorSubject } from "rxjs";
import { filter } from 'rxjs/operators';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController, Platform } from "@ionic/angular";

import { LocationErrors } from "../shared/common.enum";
import { TranslateService } from "@ngx-translate/core";


@Injectable({ providedIn: 'root' })
export class MapService {


    private _position = new BehaviorSubject<any>({});
    private _status   = new BehaviorSubject<LocationErrors>(undefined);


    get position() { return this._position.asObservable() }

    get status() { return this._status.asObservable() }


    /** @ignore */
    constructor(private translate: TranslateService,
                private geolocation: Geolocation,
                private diagnostic: Diagnostic,
                private alertCtrl: AlertController,
                private platform: Platform) { }


    async checkGPSPermission() {

        const auth = await this.diagnostic.isLocationAuthorized();

        console.log("Location permissions: " + auth);

    }


    watchLocation() {
        return this.geolocation.watchPosition({ timeout: 3000, enableHighAccuracy: true, maximumAge: 0 });
    }


    async startPositionWatch(fromClick = false) {

        const authStatus = await this.diagnostic.getLocationAuthorizationStatus();

        console.log("Auth: " + authStatus);

        if (fromClick && authStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
            this.presetErrAlert(LocationErrors.AUTH_ERROR);
            return LocationErrors.AUTH_ERROR;
        }

        if (authStatus !== this.diagnostic.permissionStatus.GRANTED ||
            authStatus !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {

            const req = await this.diagnostic.requestLocationAuthorization();

            console.log("Permission: " + req);

            if (req === this.diagnostic.permissionStatus.DENIED_ALWAYS ||
                req === this.diagnostic.permissionStatus.DENIED_ONCE) {

                console.log("Permissions definitely denied");

                return LocationErrors.AUTH_ERROR;

            }

        }

        const gps = await this.diagnostic.isLocationEnabled();

        console.log("GPS on: " + gps);

        if (!gps) {

            if (fromClick) this.presetErrAlert(LocationErrors.GPS_ERROR);

            return LocationErrors.GPS_ERROR;

        }

        return LocationErrors.NO_ERROR;

    }


    /**
     * Opens an alert to communicate an error to the user.
     *
     * @param {LocationErrors} errType - The type of the error.
     */
    async presetErrAlert(errType: LocationErrors) {

        // Translation key of the alert message
        const mKey = errType === LocationErrors.AUTH_ERROR ? "page-map.alert-message-auth" : "page-map.alert-message-gps";

        // Create the alert
        const alert = await this.alertCtrl.create({
            subHeader: this.translate.instant(mKey),
            buttons  : [this.translate.instant("common.alerts.button-ok")]
        });

        // Present the alert
        await alert.present();

    }


}
