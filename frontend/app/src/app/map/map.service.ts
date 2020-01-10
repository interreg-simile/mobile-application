import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { BehaviorSubject, Observable } from "rxjs";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationErrors } from "../shared/common.enum";


@Injectable({ providedIn: 'root' })
export class MapService {


    private _position = new BehaviorSubject<any>({});


    get position() { return this._position.asObservable() }


    /** @ignore */
    constructor(private geolocation: Geolocation, private diagnostic: Diagnostic) { }


    async checkGPSPermission() {

        const auth = await this.diagnostic.isLocationAuthorized();

        console.log("Location permissions: " + auth);

    }


    watchLocation() {

        return navigator.geolocation.watchPosition(
            data => console.log(data),
            err => console.error(err),
            {
                timeout           : 1000,
                enableHighAccuracy: true
            }
        );

    }


    async startPositionWatch() {

        const auth = await this.diagnostic.isLocationAuthorized();

        console.log("Auth: " + auth);

        if (!auth) {

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

        if (!gps) return LocationErrors.GPS_ERROR;

        return LocationErrors.NO_ERROR;

    }


}
