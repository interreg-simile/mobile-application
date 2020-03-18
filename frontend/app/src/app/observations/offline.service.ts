import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { NGXLogger } from "ngx-logger";


@Injectable({ providedIn: 'root' })
export class OfflineService {

    private readonly _storageKey = "observations";


    constructor(private storage: Storage, private logger: NGXLogger) { }


    async getStoredObservations(): Promise<Array<any>> {

        const storedData = await this.storage.get(this._storageKey);

        return JSON.parse(storedData);

    }


    async storeObservation(data: any): Promise<void> {

        this.logger.log("Storing the observation...");

        let storedObs = await this.getStoredObservations();

        if (storedObs)
            storedObs.push(data);
        else
            storedObs = [data];

        await this.storage.set(this._storageKey, JSON.stringify(storedObs));

    }


    // ToDo remove
    async clearAll(): Promise<void> {

        await this.storage.remove(this._storageKey);

    }


}
