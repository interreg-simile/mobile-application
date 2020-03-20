import { Injectable } from '@angular/core';
import { DirectoryEntry, File, FileEntry } from '@ionic-native/file/ngx';
import { NGXLogger } from "ngx-logger";


@Injectable({ providedIn: 'root' })
export class FileService {

    private readonly _dataDir: string;

    private readonly _imagesDir = "images";


    constructor(private file: File, private logger: NGXLogger) {

        this._dataDir = this.file.dataDirectory;

    }


    async createImageDir(): Promise<void> { return this.createDirectory(this._imagesDir) }


    private async createDirectory(dirName: string): Promise<void> {

        const doesExist = await this.checkDirExistence(dirName);

        if (!doesExist)
            await this.file.createDir(this._dataDir, dirName, false);

    }


    private async checkDirExistence(dirName: string): Promise<boolean> {

        return await this.file.checkDir(this._dataDir, dirName)
            .then(() => true)
            .catch(() => false);

    }


    async storeImage(imgUrl: string): Promise<string> {

        const fileEntry = await this.file.resolveLocalFilesystemUrl(imgUrl);
        const fileName  = fileEntry.name;

        const dataDirEntry = await this.file.resolveDirectoryUrl(this._dataDir);
        const dirEntry     = await this.file.getDirectory(dataDirEntry, this._imagesDir, null);

        return new Promise((resolve, reject) => {

            fileEntry.moveTo(dirEntry,
                fileName,
                file => resolve(file.nativeURL),
                err => {
                    this.logger.error("Error moving file.", err);
                    reject();
                });

        });


    }


    /**
     * Appends an image to a given formData.
     *
     * @param {FormData} formData - The formData.
     * @param {string} url - The url of the photo.
     * @param {string} field - The name of the field.
     */
    async appendImage(formData: FormData, url: string, field: string): Promise<void> {

        const entry                = await this.file.resolveLocalFilesystemUrl(url);
        const fileEntry: FileEntry = entry as any;

        return new Promise((resolve, reject) => {

            fileEntry.file(file => {

                const reader = new FileReader();

                reader.onloadend = () => {
                    const imgBlob = new Blob([reader.result], { type: "image/jpeg" });
                    formData.append(field, imgBlob, file.name);
                    resolve()
                };

                reader.onerror = err => reject(err);

                reader.readAsArrayBuffer(file);

            }, err => reject(err));

        });

    }


}
