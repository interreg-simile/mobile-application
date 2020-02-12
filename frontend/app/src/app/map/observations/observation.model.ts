import { LatLng } from 'leaflet';


export interface Position {
    coordinates?: Number[],
    accuracy?: Number,
    custom?: Boolean,
    address?: String,
    lake?: String
}


export interface Weather {
    temperature?: number,
    sky?: { code?: number, description?: String },
    wind?: number
}


export interface Details {
    algae?: { extension?: String, look?: String, colour?: String },
    foams?: { extension?: String, look?: String, height?: String },
    oils?: { extension?: String, type?: String },
    litters?: { quantity?: String, type?: String[] },
    odours?: { intensity?: String, origin?: String[] },
    outlets?: {
        inPlace?: Boolean,
        terminal?: String,
        colour?: String,
        vapour?: Boolean,
        signage?: Boolean,
        signagePhoto?: String,
        prodActNearby?: Boolean,
        prodActNearbyDetails?: String
    },
    fauna?: { extension?: String, look?: String, colour?: String },
    other?: {
        deceased?: { fish?: Boolean, birds?: Boolean, other?: String },
        abnormal?: { fish?: Boolean, birds?: Boolean, other?: String },
        alienSpecies: {
            crustaceans?: Boolean,
            molluscs?: Boolean,
            turtles?: Boolean,
            fish?: Boolean,
            birds?: Boolean,
            other?: String,
        }
    }
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


export interface Observation {
    id: String,
    createdAt: Date,
    uid: String,
    position: Position,
    weather: Weather,
    details?: Details,
    photos: [String],
    measures?: Measures
}
