import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import set from "lodash-es/set";
import get from "lodash-es/get";
import { TranslateService } from "@ngx-translate/core";

import { ObservationsService } from "../observations.service";
import { ToastService } from "../../shared/toast.service";
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
                private authService: AuthService,
                public i18n: TranslateService) { }


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


        // ToDo delete
        this._obs       = dummyObs;
        this._isLoading = false;


        // ToDo uncomment
        // Retrieve the observation
        // this.obsService.getObservationById(id)
        //     .then(obs => {
        //         console.log(obs);
        //         this._obs = obs;
        //     })
        //     .catch(err => {
        //         console.error(err);
        //         this.toastService.presentToast("page-info-obs.err-get", Duration.short);
        //         this.navCtr.back();
        //     })
        //     .finally(() => this._isLoading = false)

    }


    // ToDo
    onDeleteClick() { }


    /**
     * Fired when the user clicks on the header of a section. It toggles the visibility of the section.
     *
     * @param {string} prop - The property visualized in the section.
     */
    onToggleClick(prop: string): void {

        if (prop === "details.otherOpen") {
            this._obs.details.otherOpen = !this._obs.details.otherOpen;
            return;
        }

        set(this._obs, `${ prop }.open`, !(get(this._obs, `${ prop }.open`)));

    }


    // ToDo
    onSignagePhotoClick() { }

}


// ToDo delete
const dummyObs: ObsInfo = {
    uid      : "5dd7bbe0701d5bdd685c1f18",
    position : {
        type       : "Point",
        coordinates: [9.45621358, 45.12346895],
        crs: {code: 1, description: "WGS 84"},
        accuracy   : 20,
        custom     : true,
        roi        : "00000000000000000000001"
    },
    weather  : {
        temperature: 21.5,
        sky        : { code: 1, description: "Cielo sereno" },
        wind       : 25.63
    },
    photos   : [
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fit%2Ffoto%2Flake-water-pollution-gm1026572746-275286406&psig=AOvVaw3m59jJScY_l1apHQSrM2NF&ust=1583144409128000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjotdOG-ecCFQAAAAAdAAAAABAD",
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fit%2Fsearch%2Flake%2Bpolluted&psig=AOvVaw3m59jJScY_l1apHQSrM2NF&ust=1583144409128000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjotdOG-ecCFQAAAAAdAAAAABAJ",
        "https://www.google.com/url?sa=i&url=http%3A%2F%2Fe993.com%2Fforex%2FPollution-in-a-Lake%2F&psig=AOvVaw3m59jJScY_l1apHQSrM2NF&ust=1583144409128000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPjotdOG-ecCFQAAAAAdAAAAABAP"
    ],
    details  : {
        algae  : {
            extension : { code: 1, description: "< 5 mq" },
            look      : { code: 1, description: "Disperse" },
            colour    : { code: 1, description: "Rosso" },
            iridescent: true
        },
        foams  : {
            extension: { code: 1, description: "< 5 mq" },
            look     : { code: 1, description: "Disperse" },
            height   : { code: 1, description: "< 3 cm" }
        },
        oils   : {
            extension: { code: 1, description: "< 5 mq" },
            type     : { code: 1, description: "Superficiale" }
        },
        litters: {
            quantity: { code: 1, description: "1" },
            type    : [
                { code: 1, description: "Plastica" },
                { code: 2, description: "Vetro / Ceramica" },
                { code: 3, description: "Metallo" }
            ]
        },
        odours : {
            intensity: { code: 1, description: "Lieve" },
            origin   : [{ code: 1, description: "Pesce" }, { code: 2, description: "Muffa" }]
        },
        outlets: {
            inPlace             : true,
            terminal            : { code: 1, description: "Visibile" },
            colour              : { code: 1, description: "Rosso" },
            vapour              : false,
            signage             : true,
            signagePhoto        : "https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.wwfbergamobrescia.it%2F2018%2F09%2F18%2Fscarichi-fognari-nel-lago-di-garda-la-situazione-di-allarme-si-protrae-ormai-da-anni%2F&psig=AOvVaw3ThZC4RpbukKcOACL5HZqW&ust=1583144852371000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKCK5KaI-ecCFQAAAAAdAAAAABAE",
            prodActNearby       : true,
            prodActNearbyDetails: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
        },
        other  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    measures : {
        transparency: {
            val       : 2,
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        temperature : {
            multiple  : true,
            val       : [{ depth: 1, val: 25 }, { depth: 2, val: 24 }, { depth: 5, val: 20 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        ph          : {
            multiple  : false,
            val       : [{ depth: 1, val: 7 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        oxygen      : {
            multiple  : true,
            percentage: true,
            val       : [{ depth: 1, val: 23 }, { depth: 2, val: 25 }, { depth: 3, val: 24 }],
            instrument: {
                type     : { code: 1, description: "Professionale" },
                precision: 2,
                details  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            }
        },
        bacteria    : {
            escherichiaColi: 100,
            enterococci    : 130
        }
    },
    createdAt: "2020-02-29T15:23:06.121+00:00",
    updatedAt: "2020-02-29T15:23:06.121+00:00"
};
