import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


export enum PicResult {
    NO_IMAGE,
    ERROR
}


@Injectable({ providedIn: "root" })
export class CameraService {

    private _win: any = window;

    private _baseOpts: CameraOptions = {
        quality           : 50,
        destinationType   : this.camera.DestinationType.FILE_URI,
        encodingType      : this.camera.EncodingType.JPEG,
        mediaType         : this.camera.MediaType.PICTURE,
        cameraDirection   : this.camera.Direction.BACK,
        allowEdit         : false,
        correctOrientation: true
    };


    constructor(private camera: Camera) { }


    /** Takes a picture.
     *
     * @param {boolean} [fromGallery=false] True if the picture has to be from library.
     * @return {Promise<string | PicResult>} The uri of the picture or an error.
     */
    async takePicture(fromGallery: boolean = false): Promise<string | PicResult> {

        const opts = {
            ...this._baseOpts,
            sourceType: fromGallery ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA
        }

        let [pic, err] = await this.camera.getPicture(opts)
            .then(v => [v, undefined])
            .catch(e => [undefined, e]);

        if (err !== undefined) return err === "No Image Selected" ? PicResult.NO_IMAGE : PicResult.ERROR;

        return pic;

    }


    /**
     * Resolves the file corresponded to an image url.
     *
     * @param {string} url - The image url.
     * @return {string} The resolved file path.
     */
    getImgSrc(url: string): string {

        if (!url) return;

        return this._win.Ionic.WebView.convertFileSrc(url);

    }

}
