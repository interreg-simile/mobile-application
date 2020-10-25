import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { NGXLogger } from "ngx-logger";
import { FileService } from "../shared/file.service";
import get from "lodash-es/get";
import set from "lodash-es/set";

@Injectable({ providedIn: "root" })
export class OfflineService {
  private readonly _storageKey = "observations";

  constructor(
    private storage: Storage,
    private logger: NGXLogger,
    private fileService: FileService
  ) {}

  /**
   * Fetches all the locally stored observations.
   *
   * @return {Promise<Object[]>} A promise containing all the stored observations.
   */
  async getStoredObservations(): Promise<Array<any>> {
    const storedData = await this.storage.get(this._storageKey);

    return JSON.parse(storedData);
  }

  /**
   * Saves an observation in the device local storage.
   *
   * @param {Object} data - The data to save.
   */
  async storeObservation(data: any): Promise<void> {
    for (let i = 0; i < data.photos.length; i++) {
      if (data.photos[i])
        data.photos[i] = await this.fileService.storeImage(data.photos[i]);
    }

    const signagePhoto = get(data, "details.outlets.signagePhoto");

    if (signagePhoto) {
      const signagePhotoMovedUrl = await this.fileService.storeImage(
        signagePhoto
      );
      set(data, "details.outlets.signagePhoto", signagePhotoMovedUrl);
    }

    let storedObs = await this.getStoredObservations();

    data.createdAt = new Date().toISOString();

    if (storedObs) storedObs.push(data);
    else storedObs = [data];

    await this.storage.set(this._storageKey, JSON.stringify(storedObs));
  }

  /**
   * Saves an array of observations in the device local storage.
   *
   * @param {Array<Object>} data - The data to be saved.
   */
  async storeObservations(data: Array<any>): Promise<void> {
    await this.storage.set(this._storageKey, JSON.stringify(data));
  }
}
