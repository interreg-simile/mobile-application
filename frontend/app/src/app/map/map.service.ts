import { Injectable } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController } from "@ionic/angular";
import { point, multiPolygon } from "@turf/helpers";
import { booleanPointInPolygon } from "@turf/turf";

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

        console.log(`Location authorization status: ${ authStatus }`);

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

            console.log(`Permission requested. Answer: ${ req }`);

            // If the permission is still denied, return an error
            if (req === this.diagnostic.permissionStatus.DENIED_ALWAYS ||
                req === this.diagnostic.permissionStatus.DENIED_ONCE) return LocationErrors.AUTH_ERROR;

        }

        // Check if the GPS is enabled
        const gps = await this.diagnostic.isLocationEnabled();

        console.log(`GPS status: ${ gps }`);

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


    // ToDo
    pointInRois() {

        const pComo = point([9.260101318359375, 46.00554713642256]);

        const pOut = point([8.9923095703125, 46.08228057808761]);


        const comoBB = [[
            [9.416656494140625, 46.15748058961549],
            [9.372711181640625, 46.18743678432541],
            [9.328765869140623, 46.16936992120204],
            [9.293060302734375, 46.152248469722345],
            [9.259414672851562, 46.1279839595552],
            [9.248428344726562, 46.064179188452286],
            [9.2120361328125, 46.025098065683686],
            [9.216156005859375, 45.991714256768006],
            [9.150238037109375, 45.97167430006619],
            [9.106292724609375, 45.94685287513411],
            [9.124832153320312, 45.88618457602257],
            [9.068527221679688, 45.86228122137575],
            [9.04449462890625, 45.816836521850206],
            [9.068527221679688, 45.80199916666154],
            [9.106292724609375, 45.80199916666154],
            [9.108352661132812, 45.828320792071516],
            [9.13238525390625, 45.84649937512838],
            [9.173583984375, 45.868018964152476],
            [9.17083740234375, 45.9258414459865],
            [9.217529296875, 45.942078249410415],
            [9.253921508789062, 45.969288107767774],
            [9.2724609375, 45.924408558629004],
            [9.289627075195312, 45.89000815866184],
            [9.344558715820312, 45.86849708265214],
            [9.367218017578125, 45.84123776445225],
            [9.417343139648438, 45.845542755655856],
            [9.383010864257812, 45.88618457602257],
            [9.354171752929686, 45.90482205540977],
            [9.332199096679688, 45.921065010863714],
            [9.317779541015625, 45.95496879511337],
            [9.306106567382812, 45.99266835949146],
            [9.2999267578125, 46.02319096222853],
            [9.33013916015625, 46.05846172666742],
            [9.326705932617188, 46.081328021385964],
            [9.339065551757812, 46.10561307998295],
            [9.376144409179688, 46.12608040848373],
            [9.393997192382812, 46.14939437647686],
            [9.416656494140625, 46.15748058961549]
        ]];

        const maggioreBB = [[
                [8.8714599609375, 46.15319980124842],
                [8.839874267578125, 46.1912395780416],
                [8.79730224609375, 46.18268292219694],
                [8.738250732421873, 46.159858661486396],
                [8.677825927734373, 46.126556302418514],
                [8.664093017578125, 46.09418614922648],
                [8.67645263671875, 46.06560846138691],
                [8.68743896484375, 46.03606263383459],
                [8.639373779296875, 46.00745484843494],
                [8.602294921875, 45.98074089324607],
                [8.584442138671875, 45.947330315089275],
                [8.5418701171875, 45.93778073466329],
                [8.493804931640625, 45.948285182663],
                [8.4649658203125, 45.93300532761351],
                [8.46771240234375, 45.90625544858718],
                [8.5089111328125, 45.882360730184025],
                [8.543243408203125, 45.86419386810264],
                [8.556976318359373, 45.83932432809877],
                [8.524017333984375, 45.81348649679973],
                [8.524017333984375, 45.78189063850085],
                [8.543243408203125, 45.75027686430362],
                [8.55560302734375, 45.72152152227954],
                [8.600921630859375, 45.706179285330855],
                [8.62701416015625, 45.72631510756138],
                [8.622894287109375, 45.74069339553309],
                [8.60504150390625, 45.75985868785574],
                [8.581695556640625, 45.78284835197676],
                [8.620147705078125, 45.80391388619765],
                [8.63800048828125, 45.81827218518002],
                [8.63800048828125, 45.84219445795288],
                [8.617401123046873, 45.869931413475676],
                [8.611907958984375, 45.89383147810292],
                [8.64349365234375, 45.91294412737392],
                [8.66546630859375, 45.92822950933618],
                [8.694305419921875, 45.9568782506322],
                [8.749237060546875, 45.98646639778119],
                [8.77532958984375, 46.03224911770703],
                [8.74786376953125, 46.06370275591751],
                [8.754730224609375, 46.09418614922648],
                [8.83026123046875, 46.128459837044915],
                [8.8714599609375, 46.15319980124842]
        ]];

        const rois = multiPolygon([comoBB, maggioreBB]);


        const c1T0 = performance.now();

        const check1 = booleanPointInPolygon(pOut, rois);

        const c1T1 = performance.now();

        console.log(`Check 1: ${check1} in ${c1T1-c1T0} milliseconds`);

    }


}
