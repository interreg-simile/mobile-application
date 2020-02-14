import { AlgaeComponent } from "./details/algae/algae.component";
import { FoamsComponent } from "./details/foams/foams.component";
import { OilsComponent } from "./details/oils/oils.component";
import { LittersComponent } from "./details/litters/litters.component";


export interface Position {
    coordinates?: number[],
    accuracy?: number,
    custom?: boolean,
    // address?: string,
    lake?: number
}


export interface Weather {
    temperature?: number,
    sky?: number,
    wind?: number
}


export interface Algae {
    checked?: boolean,
    component?: Object,
    extension?: number,
    colour?: number,
    iridescent?: boolean,
    look?: number
}

export interface Foams {
    checked?: boolean,
    component?: Object,
    extension?: number,
    look?: number,
    height?: number
}

export interface Oils {
    checked?: boolean,
    component?: Object,
    extension?: number,
    type?: number
}

export interface Litters {
    checked?: boolean,
    component?: Object,
    quantity?: number,
    type?: number[]
}

export interface Odours {
    checked?: boolean,
    component?: Object,
    intensity?: String,
    origin?: String[]
}

export interface Outlets {
    checked?: boolean,
    component?: Object,
    inPlace?: Boolean,
    terminal?: String,
    colour?: String,
    vapour?: Boolean,
    signage?: Boolean,
    signagePhoto?: String,
    prodActNearby?: Boolean,
    prodActNearbyDetails?: String
}

export interface Fauna {
    checked?: boolean,
    component?: Object,
    deceased?: { fish?: Boolean, birds?: Boolean, other?: String },
    abnormal?: { fish?: Boolean, birds?: Boolean, other?: String },
    alienSpecies?: {
        crustaceans?: Boolean,
        molluscs?: Boolean,
        turtles?: Boolean,
        fish?: Boolean,
        birds?: Boolean,
        other?: String,
    }
}


export interface Details {
    algae?: Algae,
    foams?: Foams,
    oils?: Oils,
    litters?: Litters,
    odours?: Odours,
    outlets?: Outlets,
    fauna?: Fauna,
    other?: string
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
    oxygen?: { multiple: Boolean, val: { depth: Number, concentration?: Number, percentage?: Number }[], instrument: Instrument },
    bacteria?: { escherichiaColi?: Number, enterococci?: Number }
}


export class Observation {

    id: String;

    createdAt: Date;

    uid: String;

    position: Position;

    weather: Weather;

    details: Details;

    photos: [String];

    measures: Measures;


    constructor() {

        this.position = {};

        this.weather = {};

        const algae: Algae = {
            checked   : false,
            component : AlgaeComponent,
            extension : undefined,
            look      : undefined,
            colour    : undefined,
            iridescent: undefined
        };

        const foams: Foams = {
            checked  : false,
            component: FoamsComponent,
            extension: undefined,
            look     : undefined,
            height   : undefined
        };

        const oils: Oils = {
            checked  : false,
            component: OilsComponent,
            extension: undefined,
            type     : undefined
        };

        const litters: Litters = {
            checked  : false,
            component: LittersComponent,
            quantity : undefined,
            type     : undefined
        };

        this.details = {
            algae  : algae,
            foams  : foams,
            oils   : oils,
            litters: litters
        }

    }


}
