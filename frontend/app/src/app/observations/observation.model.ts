import { LatLng } from 'leaflet';
import { AlgaeComponent } from "./details/algae/algae.component";
import { FoamsComponent } from "./details/foams/foams.component";


export interface Position {
    coordinates?: Number[],
    accuracy?: Number,
    custom?: Boolean,
    address?: String,
    lake?: String
}


export interface Weather {
    temperature?: number,
    sky?: { dCode?: { code?: number }, description?: String },
    wind?: number
}


export interface Algae {
    checked?: boolean,
    component?: Object,
    extension?: { dCode?: { code?: number }, description?: String },
    look?: { dCode?: { code?: number }, description?: String },
    colour?: { dCode?: { code?: number }, iridescent?: boolean, description?: String }
}

export interface Foams {
    checked?: boolean,
    component?: Object,
    extension?: String,
    look?: String,
    height?: String
}

export interface Oils {
    checked?: boolean,
    component?: Object,
    extension?: String,
    type?: String
}

export interface Litters {
    checked?: boolean,
    component?: Object,
    quantity?: String,
    type?: String[]
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


// export interface Observation {
//     id: String,
//     createdAt: Date,
//     uid: String,
//     position: Position,
//     weather: Weather,
//     details?: Details,
//     photos: [String],
//     measures?: Measures
// }


export class Observation {

    id: String;

    createdAt: Date;

    uid: String;

    position: Position = {};

    weather: Weather = {};

    details: Details;

    photos: [String];

    measures: Measures;


    constructor() {

        this.details = {
            algae  : { checked: false, component: AlgaeComponent, extension: { dCode: { code: undefined } } },
            foams  : { checked: false, component: FoamsComponent },
            oils   : { checked: false },
            litters: { checked: false },
            odours : { checked: false },
            outlets: { checked: false },
            fauna  : { checked: false }
        }

    }

}
