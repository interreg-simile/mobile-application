import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class MapService {


    private _position = new BehaviorSubject<any>({});


    get position() { return this._position.asObservable() }


    /** @ignore */
    constructor(private geolocation: Geolocation) { }


    watchLocation() {

       return this.geolocation.watchPosition();

    }


}
