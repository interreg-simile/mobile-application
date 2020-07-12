import { Injectable } from '@angular/core';
import { DirectoryEntry, File, FileEntry } from '@ionic-native/file/ngx';
import { NGXLogger } from "ngx-logger";


@Injectable({ providedIn: 'root' })
export class FileService {

    private readonly _imagesDir = "images";


    constructor(private file: File, private logger: NGXLogger) { }


    /** Creates the directory to contain the saved observations images. */
    async createImageDir(): Promise<void> { return this.createDirectory("images") }


    /**
     * Creates a new directory in the device memory.
     *
     * @param {string} dirName - The name of the directory.
     */
    private async createDirectory(dirName: string): Promise<void> {

        const doesExist = await this.checkDirExistence(dirName);

        if (!doesExist) {

            await this.file.createDir(this.file.dataDirectory || this.file.dataDirectory, dirName, false)
                .catch(err => this.logger.error("Error creating image directory.", err));

        }

    }


    /**
     * Checks if a directory exists in the device memory.
     *
     * @param {string} dirName - The directory name.
     */
    private async checkDirExistence(dirName: string): Promise<boolean> {

        return await this.file.checkDir(this.file.dataDirectory, dirName)
            .then(() => true)
            .catch(() => false);

    }


    /**
     * Moves an image from the cache to the local memory.
     *
     * @param {string} imgUrl - The image url.
     * @return {Promise<string>} A promise containing the url of the moved image.
     */
    async storeImage(imgUrl: string): Promise<string> {

        const fileEntry = await this.file.resolveLocalFilesystemUrl(imgUrl);
        const fileName  = fileEntry.name;

        const dataDirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
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

                reader.onerror = err => {
                    this.logger.error(`Error appending image ${ url }`);
                    reject(err);
                };

                reader.readAsArrayBuffer(file);

            }, err => reject(err));

        });

    }


    /**
     * Removes an image form the local storage.
     *
     * @param {string} imgUrl - The url of the image.
     */
    async removeImage(imgUrl: string): Promise<void> {

        const fileEntry = await this.file.resolveLocalFilesystemUrl(imgUrl);

        return new Promise((resolve, reject) => {

            fileEntry.remove(
                () => {
                    this.logger.log(`File ${ fileEntry.name } removed.`);
                    resolve();
                },
                err => {
                    this.logger.error(`Error removing file ${ fileEntry.name }`, err);
                    reject();
                }
            );

        });

    }


    async urlToBase64(imgUrl: string): Promise<any> {

        const res  = await fetch(imgUrl);
        const blob = await res.blob();

        return new Promise((resolve, reject) => {
            const reader     = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror   = err => {
                this.logger.error("Error converting image to base 64", err)
                reject(err)
            }
            reader.readAsDataURL(blob)
        })

    }

    // It does not work
    async saveImageToGalley(imgUrl: string): Promise<void> {

        const dataDirEntry = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
        const dirEntry     = await this.file.getDirectory(dataDirEntry, this._imagesDir, null);

        const res  = await fetch(imgUrl);
        const blob = await res.blob();

        const fileName = `simile_${ new Date().toISOString() }`

        return new Promise((resolve, reject) => {
            dirEntry.getFile(
                'test',
                { create: true, exclusive: false },
                fileEntry => {
                    fileEntry.createWriter(
                        fileWriter => {
                            fileWriter.write(blob);
                            resolve();
                        },
                        err => {
                            this.logger.error("Error creating file writer", err);
                            reject(err);
                        }
                    )
                },
                err => {
                    this.logger.error("Error creating file", err);
                    reject(err);
                })
        })

    }

}
