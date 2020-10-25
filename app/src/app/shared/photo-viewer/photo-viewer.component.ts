import { Component, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { DomSanitizer } from "@angular/platform-browser";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery/ngx";

import { statusBarColor } from "../../app.component";
import { FileService } from "../file.service";
import { TranslateService } from "@ngx-translate/core";
import { Duration, ToastService } from "../toast.service";
import { NGXLogger } from "ngx-logger";

@Component({
  selector: "app-photo-viewer",
  templateUrl: "./photo-viewer.component.html",
  styleUrls: ["./photo-viewer.component.scss"],
})
export class PhotoViewerComponent implements OnInit {
  public src: string;
  public delete: boolean;
  public edit: boolean;
  public download: boolean = false;

  public slideOpts = { zoom: { maxRation: 2 } };

  constructor(
    private logger: NGXLogger,
    private modalCtrl: ModalController,
    private statusBar: StatusBar,
    public sanitizer: DomSanitizer,
    private fileService: FileService,
    private base64ToGallery: Base64ToGallery,
    private i18n: TranslateService,
    private loadingCtr: LoadingController,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.statusBar.backgroundColorByHexString("#000000");
  }

  /** Closes the modal. */
  async onCLoseClick(): Promise<void> {
    await this.dismiss();
  }

  /** Closes the modal after an edit command has been issued. */
  async onEditClick(): Promise<void> {
    await this.dismiss({ edit: true });
  }

  /** Closes the modal after a delete command has been issued. */
  async onDeleteClick(): Promise<void> {
    await this.dismiss({ delete: true });
  }

  /**
   * Dismisses the modal optionally passing some data.
   *
   * @param {Object} [data] - The data to pass.
   */
  async dismiss(data?): Promise<void> {
    this.statusBar.backgroundColorByHexString(statusBarColor);

    await this.modalCtrl.dismiss(data);
  }

  // It does not work!
  async onDownloadClick(): Promise<void> {
    const loading = await this.loadingCtr.create({
      message: this.i18n.instant("common.wait"),
      showBackdrop: false,
    });
    await loading.present();

    this.fileService
      .urlToBase64(this.src)
      .then((base64Img) => {
        const data = base64Img.split(",")[1];
        return this.base64ToGallery.base64ToGallery(data, {
          prefix: "simile_",
          mediaScanner: true,
        });
      })
      .then(() =>
        this.toastService.presentToast(
          "common.download-photo.success",
          Duration.short
        )
      )
      .catch((err) => {
        this.logger.error("Error downloading the photo", err);
        this.toastService.presentToast(
          "common.download-photo.error",
          Duration.short
        );
      })
      .finally(() => loading.dismiss());

    // this.fileService
    //     .saveImageToGalley(this.src)
    //     .then(() => this.toastService.presentToast("common.download-photo.success", Duration.short))
    //     .catch(err => {
    //         this.logger.error("Error downloading the photo", err)
    //         this.toastService.presentToast("common.download-photo.error", Duration.short);
    //     })
    //     .finally(() => loading.dismiss())
  }
}
