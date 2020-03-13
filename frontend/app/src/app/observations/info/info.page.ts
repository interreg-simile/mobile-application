import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import set from "lodash-es/set";
import get from "lodash-es/get";
import { TranslateService } from "@ngx-translate/core";

import { ObservationsService } from "../observations.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { AuthService } from "../../auth/auth.service";
import { ObsInfo } from "./obs-info.model";
import { DomSanitizer } from "@angular/platform-browser";
import { PhotoViewerService } from "../../shared/photo-viewer/photo-viewer.service";


@Component({ selector: 'app-info', templateUrl: './info.page.html', styleUrls: ['./info.page.scss'] })
export class InfoPage implements OnInit {

    public _isLoading: boolean;
    public _obs: ObsInfo;
    public _userId: string;

    public objKeys = Object.keys;

    // Utility function to keep the original key order when iterating on an object using ngFor
    originalOrder = (a, b) => { return 0 };


    constructor(private activatedRoute: ActivatedRoute,
                private navCtr: NavController,
                private obsService: ObservationsService,
                private toastService: ToastService,
                private authService: AuthService,
                public i18n: TranslateService,
                public domSanitizer: DomSanitizer,
                private photoViewerService: PhotoViewerService) { }


    ngOnInit() {

        this._isLoading = true;

        this._userId = this.authService.userId;

        const id = this.activatedRoute.snapshot.paramMap.get("id");
        if (!id) this.navCtr.back();

        this.obsService.getObservationById(id)
            .then(obs => {
                this._obs       = obs;
                this._isLoading = false;
            })
            .catch(err => {
                console.error(err);
                this.toastService.presentToast("page-info-obs.err-get", Duration.short);
                this.navCtr.back();
            })

    }


    /**
     * Fired when the user clicks on the header of a section. It toggles the visibility of the section.
     *
     * @param {string} prop - The property visualized in the section.
     */
    onToggleClick(prop: string): void {

        if (prop === "otherOpen") {
            this._obs.otherOpen = !this._obs.otherOpen;
            return;
        }

        set(this._obs, `${ prop }.open`, !(get(this._obs, `${ prop }.open`)));

    }


    /**
     * Checks if a detail of the observation has some sub-properties set.
     *
     * @param {string} detailPath - The path of the detail.
     * @return {boolean} If the detail has some sub-properties.
     */
    hasDetailProperties(detailPath: string): boolean {

        const prop = get(this._obs, detailPath);

        return Object.keys(prop).some(k => k !== "checked");

    }


    /**
     * Fired when the user click on the preview of a photo. It opens the photo in a viewer.
     *
     * @param {string} src - The source of the image.
     */
    async onThumbnailClick(src: string): Promise<void> {

        await this.photoViewerService.openPhotoViewer(src);

    }

}
