import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController } from "@ionic/angular";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { LatLng } from "leaflet";

import { LocationErrors } from "../shared/common.enum";
import { environment } from "../../environments/environment";
import { GenericApiResponse } from "../shared/utils.interface";


@Injectable({ providedIn: 'root' })
export class MapService {

    private readonly _positionWatcherOpts = { timeout: 3000, enableHighAccuracy: true, maximumAge: 0 };


    constructor(private http: HttpClient,
                private i18n: TranslateService,
                private geolocation: Geolocation,
                private diagnostic: Diagnostic,
                private alertCtr: AlertController) { }


    /** Starts registering the user location. */
    watchLocation(): Observable<Geoposition> { return this.geolocation.watchPosition(this._positionWatcherOpts) }


    /**
     * Checks if the app can retrieve the user position in terms of permissions and of GPS availability.
     *
     * @param {boolean} [fromClick=false] - True if the check is triggered from a user action.
     * @returns {Promise<LocationErrors>} A promise containing the location status.
     */
    async checkPositionAvailability(fromClick = false): Promise<LocationErrors> {

        const authStatus = await this.diagnostic.getLocationAuthorizationStatus();

        // If the permission is denied and cannot be asked
        if (fromClick && authStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
            this.presetErrAlert(LocationErrors.AUTH_ERROR);
            return LocationErrors.AUTH_ERROR;
        }

        // If the permission is denied, but can be asked
        if (authStatus !== this.diagnostic.permissionStatus.GRANTED ||
            authStatus !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {

            const req = await this.diagnostic.requestLocationAuthorization();

            if (req === this.diagnostic.permissionStatus.DENIED_ALWAYS ||
                req === this.diagnostic.permissionStatus.DENIED_ONCE) return LocationErrors.AUTH_ERROR;

        }

        const gps = await this.diagnostic.isLocationEnabled();

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
    async presetErrAlert(errType: LocationErrors): Promise<void> {

        const mKey = errType === LocationErrors.AUTH_ERROR ? "page-map.alert-message-auth" : "page-map.alert-message-gps";

        const alert = await this.alertCtr.create({
            subHeader: this.i18n.instant(mKey),
            buttons  : [this.i18n.instant("common.alerts.btn-ok")]
        });

        await alert.present();

    }


    /**
     * Calls the API to check in which region of interest the point with the given coordinates falls.
     *
     * @param {LatLng} coords - The coordinates of the point.
     * @returns {Promise<number>} - The code of the region of interest in which the point falls.
     */
    async pointInRoi(coords: LatLng): Promise<number> {

        const url = `${ environment.apiBaseUrl }/${ environment.apiVersion }/rois/`;

        const qParams = new HttpParams()
            .set("lat", coords.lat.toString())
            .set("lon", coords.lng.toString());

        const res = await this.http.get<GenericApiResponse>(url, { params: qParams }).toPromise();

        if (res.data.rois.length) return res.data.rois[0]._id;

        return;

    }

}
