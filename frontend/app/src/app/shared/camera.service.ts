import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Injectable({ providedIn: "root" })
export class CameraService {


    private opts: CameraOptions = {
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


    takePicture() { return this.camera.getPicture(this.opts) }


    async cleanUp() { await this.camera.cleanup() }

}
