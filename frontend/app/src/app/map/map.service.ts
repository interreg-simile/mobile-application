import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { BehaviorSubject, Observable } from "rxjs";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


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

        return this.geolocation.watchPosition({ enableHighAccuracy: true });

    }


}
