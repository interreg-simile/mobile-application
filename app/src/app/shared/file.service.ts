import {Injectable} from '@angular/core';
import {File, FileEntry} from '@ionic-native/file/ngx';
import {NGXLogger} from 'ngx-logger';

@Injectable({providedIn: 'root'})
export class FileService {
  private readonly _imagesDir = 'images';

  constructor(private file: File, private logger: NGXLogger) {
  }

  async createImageDir(): Promise<void> {
    return this.createDirectory('images');
  }

  private async createDirectory(dirName: string): Promise<void> {
    const doesExist = await this.checkDirExistence(dirName);

    if (!doesExist) {
      await this.file
        .createDir(
          this.file.dataDirectory || this.file.dataDirectory,
          dirName,
          false
        )
        .catch((err) =>
          this.logger.error('Error creating image directory.', err)
        );
    }
  }

  private async checkDirExistence(dirName: string): Promise<boolean> {
    return await this.file
      .checkDir(this.file.dataDirectory, dirName)
      .then(() => true)
      .catch(() => false);
  }

  async storeImage(imgUrl: string): Promise<string> {
    const fileEntry = await this.file.resolveLocalFilesystemUrl(imgUrl);
    const fileName = fileEntry.name;

    const dataDirEntry = await this.file.resolveDirectoryUrl(
      this.file.dataDirectory
    );
    const dirEntry = await this.file.getDirectory(
      dataDirEntry,
      this._imagesDir,
      null
    );

    return new Promise((resolve, reject) => {
      fileEntry.moveTo(
        dirEntry,
        fileName,
        (file) => resolve(file.nativeURL),
        (err) => {
          this.logger.error('Error moving file.', err);
          reject();
        }
      );
    });
  }

  async appendImage(
    formData: FormData,
    url: string,
    field: string
  ): Promise<void> {
    const entry = await this.file.resolveLocalFilesystemUrl(url);
    const fileEntry: FileEntry = entry as any;

    return new Promise((resolve, reject) => {
      fileEntry.file(
        (file) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], {type: 'image/jpeg'});
            formData.append(field, imgBlob, file.name);
            resolve();
          };

          reader.onerror = (err) => {
            this.logger.error(`Error appending image ${url}`);
            reject(err);
          };

          reader.readAsArrayBuffer(file);
        },
        (err) => reject(err)
      );
    });
  }

  async removeImage(imgUrl: string): Promise<void> {
    const fileEntry = await this.file.resolveLocalFilesystemUrl(imgUrl);

    return new Promise((resolve, reject) => {
      fileEntry.remove(
        () => {
          this.logger.log(`File ${fileEntry.name} removed.`);
          resolve();
        },
        (err) => {
          this.logger.error(`Error removing file ${fileEntry.name}`, err);
          reject();
        }
      );
    });
  }

  async urlToBase64(imgUrl: string): Promise<any> {
    const res = await fetch(imgUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (err) => {
        this.logger.error('Error converting image to base 64', err);
        reject(err);
      };
      reader.readAsDataURL(blob);
    });
  }
}
