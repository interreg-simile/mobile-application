import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController } from "@ionic/angular";

import { LocationErrors } from "../shared/common.enum";
import { TranslateService } from "@ngx-translate/core";


/**
 * Service to handle the map logic. It allows to check if the application is able to retrieve the user position and to
 * start recording it.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */
@Injectable({ providedIn: 'root' })
export class MapService {


    /** @ignore */
    constructor(private translate: TranslateService,
                private geolocation: Geolocation,
                private diagnostic: Diagnostic,
                private alertCtrl: AlertController) { }


    /** Starts registering the user location. */
    watchLocation() {
        return this.geolocation.watchPosition({ timeout: 3000, enableHighAccuracy: true, maximumAge: 0 });
    }


    /**
     * Checks if the app can retrieve the user position in terms of permissions and of GPS availability.
     *
     * @param {boolean} [fromClick=false] - True if the check is triggered from a user action.
     * @returns {LocationErrors} The location status.
     */
    async checkPositionAvailability(fromClick = false) {

        // Get the location authorization status
        const authStatus = await this.diagnostic.getLocationAuthorizationStatus();

        console.log(`Location authorization status: ${authStatus}`);

        // If the permission is denied and cannot be asked, return an error
        if (fromClick && authStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
            this.presetErrAlert(LocationErrors.AUTH_ERROR);
            return LocationErrors.AUTH_ERROR;
        }

        // If the permission is denied, but can be asked
        if (authStatus !== this.diagnostic.permissionStatus.GRANTED ||
            authStatus !== this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {

            // Ask the permission
            const req = await this.diagnostic.requestLocationAuthorization();

            console.log(`Permission requested. Answer: ${req}`);

            // If the permission is still denied, return an error
            if (req === this.diagnostic.permissionStatus.DENIED_ALWAYS ||
                req === this.diagnostic.permissionStatus.DENIED_ONCE) return LocationErrors.AUTH_ERROR;

        }

        // Check if the GPS is enabled
        const gps = await this.diagnostic.isLocationEnabled();

        console.log(`GPS status: ${gps}`);

        // If the gps is not enabled, return an error
        if (!gps) {
            if (fromClick) this.presetErrAlert(LocationErrors.GPS_ERROR);
            return LocationErrors.GPS_ERROR;
        }

        // Return no errors
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
