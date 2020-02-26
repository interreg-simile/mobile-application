import { AlgaeComponent } from "./details/algae/algae.component";
import { FoamsComponent } from "./details/foams/foams.component";
import { OilsComponent } from "./details/oils/oils.component";
import { LittersComponent } from "./details/litters/litters.component";
import { OdoursComponent } from "./details/odours/odours.component";
import { OutletsComponent } from "./details/outlets/outlets.component";
import { FaunaComponent } from "./details/fauna/fauna.component";
import { LatLng } from "leaflet";
import { TransparencyComponent } from "./measures/transparency/transparency.component";
import { TemperatureComponent } from "./measures/temperature/temperature.component";
import { PhComponent } from "./measures/ph/ph.component";
import { OxygenComponent } from "./measures/oxygen/oxygen.component";
import { BacteriaComponent } from "./measures/bacteria/bacteria.component";


export interface Position {
    coordinates: LatLng,
    accuracy: number,
    custom: boolean,
    roi?: string
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
    professional: boolean,
    brand: string,
    precision: string,
    details: string
}

export interface Transparency {
    checked: boolean,
    component: Object,
    val: string,
    instrument: Instrument
}

export interface Temperature {
    checked: boolean,
    component: Object,
    multiple: boolean,
    val: any[],
    instrument: Instrument
}

export interface Ph {
    checked: boolean,
    component: Object,
    multiple: boolean,
    val: any[],
    instrument: Instrument
}

export interface Oxygen {
    checked: boolean,
    component: Object,
    multiple: boolean,
    val: any[],
    instrument: Instrument
}

export interface Bacteria {
    checked: boolean,
    component: Object,
    escherichiaColi: number
    enterococci: number
}

export interface Measures {
    transparency: Transparency,
    temperature: Temperature,
    ph: Ph,
    oxygen: Oxygen,
    bacteria: Bacteria
}


export class Observation {

    id: String;

    createdAt: Date;

    uid: String;

    position: Position;

    weather: Weather;

    details: Details;

    photos: Array<string>;

    measures: Measures;


    /**
     * Create a new observation and initializes all the values except for the passed ones to undefined.
     *
     * @param {LatLng} coords - The coordinated of the new observation.
     * @param {number} accuracy - The accuracy of the coordinates.
     * @param {boolean} custom - True is the user has chosen the observation position long tapping on the map.
     */
    constructor(coords: LatLng, accuracy: number, custom: boolean) {


        this.position = {
            coordinates: coords,
            accuracy   : accuracy,
            custom     : custom
        };

        this.weather = {
            temperature: undefined,
            sky        : { code: 1 },
            wind       : undefined
        };

        this.photos = [undefined, undefined, undefined];


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


        const transparency: Transparency = {
            checked   : false,
            component : TransparencyComponent,
            val       : undefined,
            instrument: { professional: undefined, brand: undefined, precision: undefined, details: undefined }
        };

        const temperature: Temperature = {
            checked   : false,
            component : TemperatureComponent,
            multiple  : undefined,
            val       : [],
            instrument: { professional: undefined, brand: undefined, precision: undefined, details: undefined }
        };

        const ph: Ph = {
            checked   : false,
            component : PhComponent,
            multiple  : undefined,
            val       : [],
            instrument: { professional: undefined, brand: undefined, precision: undefined, details: undefined }
        };

        const oxygen: Oxygen = {
            checked   : false,
            component : OxygenComponent,
            multiple  : undefined,
            val       : [],
            instrument: { professional: undefined, brand: undefined, precision: undefined, details: undefined }
        };

        const bacteria: Bacteria = {
            checked        : false,
            component      : BacteriaComponent,
            escherichiaColi: undefined,
            enterococci    : undefined
        };

        this.measures = {
            transparency: transparency,
            temperature : temperature,
            ph          : ph,
            oxygen      : oxygen,
            bacteria    : bacteria
        }

    }


}
