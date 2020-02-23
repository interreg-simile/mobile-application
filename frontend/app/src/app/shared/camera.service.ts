import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


export enum PicResult {
    NO_IMAGE,
    ERROR
}


@Injectable({ providedIn: "root" })
export class CameraService {


    private _win: any = window;


    private _opts: CameraOptions = {
        quality           : 50,
        destinationType   : this.camera.DestinationType.FILE_URI,
        encodingType      : this.camera.EncodingType.JPEG,
        mediaType         : this.camera.MediaType.PICTURE,
        sourceType        : this.camera.PictureSourceType.CAMERA,
        cameraDirection   : this.camera.Direction.BACK,
        allowEdit         : false,
        correctOrientation: true
    };


    /** @ignore */
    constructor(private camera: Camera) { }


    /**
     * @return {Promise<String | PicResult>}
     */
    async takePicture() {

        let [pic, err] = await this.camera.getPicture(this._opts).then(v => [v, undefined]).catch(e => [undefined, e]);

        if (err !== undefined) return err === "No Image Selected" ? PicResult.NO_IMAGE : PicResult.ERROR;

        return pic;

    }


    async cleanUp() { await this.camera.cleanup() }


    /**
     * Resolves the file corresponded to an image url.
     *
     * @param {string} url - The image url.
     * @return {string} The resolved file path.
     */
    getImgSrc(url: string): string {

        // If no user is provided, return
        if (!url) return;

        console.log(typeof this._win.Ionic.WebView.convertFileSrc(url), this._win.Ionic.WebView.convertFileSrc(url));

        // Resolve the file
        return this._win.Ionic.WebView.convertFileSrc(url);

    }

}
