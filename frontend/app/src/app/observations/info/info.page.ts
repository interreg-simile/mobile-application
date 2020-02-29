import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import set from "lodash-es/set";
import get from "lodash-es/get";

import { ObservationsService } from "../observations.service";
import { Duration, ToastService } from "../../shared/toast.service";
import { AuthService } from "../../auth/auth.service";
import { ObsInfo } from "./obs-info.model";


@Component({ selector: 'app-info', templateUrl: './info.page.html', styleUrls: ['./info.page.scss'] })
export class InfoPage implements OnInit {


    /** Flag that states if something is loading. */
    public _isLoading: boolean;

    /** Observation to display. */
    public _obs: ObsInfo;

    /** The id of the currently logged user. */
    public _userId: string;


    /** @ignore */
    constructor(private activatedRoute: ActivatedRoute,
                private navCtr: NavController,
                private obsService: ObservationsService,
                private toastService: ToastService,
                private authService: AuthService) { }


    /** @ignore */
    ngOnInit() {

        // Set is loading to true
        this._isLoading = true;

        // Retrieve the id of the currently logged user
        this._userId = this.authService.userId;

        // Retrieve the id from the url
        const id = this.activatedRoute.snapshot.paramMap.get("id");

        // If no id is found, navigate back
        if (!id) this.navCtr.back();

        // Retrieve the observation
        this.obsService.getObservationById(id)
            .then(obs => {
                console.log(obs);
                this._obs = obs;
            })
            .catch(err => {
                console.error(err);
                this.toastService.presentToast("page-info-obs.err-get", Duration.short);
                this.navCtr.back();
            })
            .finally(() => this._isLoading = false)

    }


    // ToDo
    onDeleteClick() { }


    onToggleClick(prop: string): void {

        set(this._obs, `${prop}.open`, !(get(this._obs, `${prop}.open`)));

    }



}
