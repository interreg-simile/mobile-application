import { AlgaeComponent } from "./details/algae/algae.component";
import { FoamsComponent } from "./details/foams/foams.component";
import { OilsComponent } from "./details/oils/oils.component";
import { LittersComponent } from "./details/litters/litters.component";
import { OdoursComponent } from "./details/odours/odours.component";
import { OutletsComponent } from "./details/outlets/outlets.component";
import { FaunaComponent } from "./details/fauna/fauna.component";


export interface Position {
    coordinates: number[],
    accuracy: number,
    custom: boolean,
    lake: { code: number }
}


export interface Weather {
    temperature: number,
    sky: { code: number },
    wind: number
}


export interface Algae {
    checked: boolean,
    component: Object,
    extension: { code: number },
    colour: { code: number },
    iridescent: boolean,
    look: { code: number },
}

export interface Foams {
    checked: boolean,
    component: Object,
    extension: { code: number },
    look: { code: number },
    height: { code: number }
}

export interface Oils {
    checked: boolean,
    component: Object,
    extension: { code: number },
    type: { code: number }
}

export interface Litters {
    checked: boolean,
    component: Object,
    quantity: { code: number },
    type: any[]
}

export interface Odours {
    checked: boolean,
    component: Object,
    intensity: { code: number },
    origin: any[]
}

export interface Outlets {
    checked: boolean,
    component: Object,
    inPlace: boolean,
    terminal: { code: number },
    colour: { code: number },
    vapour: boolean,
    signage: boolean,
    signagePhoto: string,
    prodActNearby: boolean,
    prodActNearbyDetails: string
}

export interface Fauna {
    checked: boolean,
    component: Object,
    deceased: {
        fish: { checked: boolean, details: string },
        birds: { checked: boolean, details: string },
        other: { checked: boolean, details: string }
    },
    abnormal: {
        fish: { checked: boolean, details: string },
        birds: { checked: boolean, details: string },
        other: { checked: boolean, details: string }
    },
    alienSpecies: {
        crustaceans: { checked: boolean, details: string },
        molluscs: { checked: boolean, details: string },
        turtles: { checked: boolean, details: string },
        fish: { checked: boolean, details: string },
        birds: { checked: boolean, details: string },
        other: { checked: boolean, details: string },
    }
}


export interface Details {
    algae: Algae,
    foams: Foams,
    oils: Oils,
    litters: Litters,
    odours: Odours,
    outlets: Outlets,
    fauna: Fauna,
    other: string
}


interface Instrument {
    professional?: Boolean,
    brand?: String,
    precision?: String,
    details?: String
}

interface Measures {
    transparency?: { val: Number, instrument: Instrument },
    temperature?: { multiple: Boolean, val: { depth: Number, val: Number }[], instrument: Instrument },
    ph?: { multiple: Boolean, val: { depth: Number, val: Number }[], instrument: Instrument },
    oxygen?: { multiple: Boolean, val: { depth: Number, concentration: { code: number }, percentage: { code: number } }[], instrument: Instrument },
    bacteria?: { escherichiaColi: { code: number }, enterococci: { code: number } }
}


export class Observation {

    id: String;

    createdAt: Date;

    uid: String;

    position: Position;

    weather: Weather;

    details: Details;

    photos: String[];

    measures: Measures;


    /**
     * Create a new observation and initializes all the values except for the passed ones to undefined.
     *
     * @param {number[]} coords - The coordinated of the new observation in form [lat, lon].
     * @param {number} accuracy - The accuracy of the coordinates.
     * @param {boolean} custom - True is the user has chosen the observation position long tapping on the map.
     */
    constructor(coords: number[], accuracy: number, custom: boolean) {

        this.position = {
            coordinates: coords,
            accuracy   : accuracy,
            custom     : custom,
            lake       : { code: undefined }
        };

        this.weather = {
            temperature: undefined,
            sky        : { code: undefined },
            wind       : undefined
        };

        const algae: Algae = {
            checked   : false,
            component : AlgaeComponent,
            extension : { code: undefined },
            look      : { code: undefined },
            colour    : { code: undefined },
            iridescent: undefined
        };

        const foams: Foams = {
            checked  : false,
            component: FoamsComponent,
            extension: { code: undefined },
            look     : { code: undefined },
            height   : { code: undefined }
        };

        const oils: Oils = {
            checked  : false,
            component: OilsComponent,
            extension: { code: undefined },
            type     : { code: undefined }
        };

        const litters: Litters = {
            checked  : false,
            component: LittersComponent,
            quantity : { code: undefined },
            type     : [],
        };

        const odours: Odours = {
            checked  : false,
            component: OdoursComponent,
            intensity: { code: undefined },
            origin   : []
        };

        const outlets: Outlets = {
            checked             : false,
            component           : OutletsComponent,
            inPlace             : undefined,
            terminal            : { code: undefined },
            colour              : { code: undefined },
            vapour              : undefined,
            signage             : undefined,
            signagePhoto        : undefined,
            prodActNearby       : undefined,
            prodActNearbyDetails: undefined
        };

        const fauna: Fauna = {
            checked     : false,
            component   : FaunaComponent,
            deceased    : {
                fish : { checked: undefined, details: undefined },
                birds: { checked: undefined, details: undefined },
                other: { checked: undefined, details: undefined }
            },
            abnormal    : {
                fish : { checked: undefined, details: undefined },
                birds: { checked: undefined, details: undefined },
                other: { checked: undefined, details: undefined }
            },
            alienSpecies: {
                crustaceans: { checked: undefined, details: undefined },
                molluscs   : { checked: undefined, details: undefined },
                turtles    : { checked: undefined, details: undefined },
                fish       : { checked: undefined, details: undefined },
                birds      : { checked: undefined, details: undefined },
                other      : { checked: undefined, details: undefined },
            }
        };

        this.details = {
            algae  : algae,
            foams  : foams,
            oils   : oils,
            litters: litters,
            odours : odours,
            outlets: outlets,
            fauna  : fauna,
            other  : undefined
        };

        this.photos = [undefined, undefined, undefined];

    }


}
