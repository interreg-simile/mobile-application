import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";


/** Name of the collection. */
export const collection = "Observations";


/** Schema of a the observation position. */
const position = new Schema({
    _id        : false,
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
    accuracy   : { type: Number, required: false },
    custom     : { type: Boolean, required: true }, // True means that the user has selected the point on the map
    address    : { type: String, required: true },
    lake       : { type: { code: { type: Number, min: 1, max: 4, required: true } }, required: true }
});


/** Schema of the weather. */
const weather = new Schema({
    _id        : false,
    temperature: { type: Number, required: true },
    sky        : { type: { code: { type: Number, min: 1, max: 6, required: true } }, required: true },
    wind       : { type: Number, required: true }
});


/** Schema of the details about algae. */
const algae = new Schema({
    _id      : false,
    extension: { code: { type: Number, min: 1, max: 3} },
    look     : { code: { type: Number, min: 1, max: 4 } },
    colour   : String // ToDo fix
});

/** Schema of the details about foams. */
const foams = new Schema({
    _id      : false,
    extension: { code: { type: Number, min: 1, max: 3 } },
    look     : { code: { type: Number, min: 1, max: 3 } },
    height   : { code: { type: Number, min: 1, max: 3 } }
});

/** Schema of the details about oils. */
const oils = new Schema({
    _id      : false,
    extension: { code: { type: Number, min: 1, max: 3} },
    type     : { code: { type: Number, min: 1, max: 2} }
});

/** Schema of the details about litter. */
const litters = new Schema({
    _id     : false,
    quantity: { code: { type: Number, min: 1, max: 3 } },
    type    : [{ code: { type: Number, min: 1, max: 10 } }]
});

/** Schema of the details about odours. */
const odours = new Schema({
    _id      : false,
    intensity: { code: { type: Number, min: 1, max: 3 } },
    origin   : [{ code: { type: Number, min: 1, max: 6, } }]
});

/** Schema of the details about outlets. */
const outlets = new Schema({
    _id                 : false,
    inPlace             : Boolean,
    terminal            : { code: { type: Number, min: 1, max: 2 } },
    colour              : String, // ToDo fix
    signage             : Boolean,
    signagePhoto        : String,
    prodActNearby       : Boolean,
    prodActNearbyDetails: String
});

/** Schema of the details about flora and fauna. */
const floraFauna = new Schema({
    _id: false,
    // ToDo complete
});

/** Schema of the observation details. */
const details = new Schema({
    _id       : false,
    algae     : algae,
    foams     : foams,
    oils      : oils,
    litter    : litters,
    odours    : odours,
    outlets   : outlets,
    floraFauna: floraFauna
});


/** Schema of an instrument. */
const instrument = new Schema({
    _id      : false,
    type     : { type: { code: { type: Number, min: 1, max: 2 } }, required: true },
    brand    : { type: String, required: false },
    precision: { type: String, required: false },
    details  : { type: String, required: false }
});

/** Schema of the details about the transparency measure. */
const transparency = new Schema({
    _id       : false,
    val       : { type: Number, required: true },
    instrument: { type: instrument, required: true }
});

/** Schema of the details about the temperature measure. */
const temperature = new Schema({
    _id       : false,
    multiple  : { type: Boolean, required: true },
    val       : { type: [{ depth: Number, val: Number }], required: true },
    instrument: { type: instrument, required: true }
});

/** Schema of the details about the pH measure. */
const ph = new Schema({
    _id       : false,
    multiple  : { type: Boolean, required: true },
    val       : { type: [{ depth: Number, val: Number }], required: true },
    instrument: { type: instrument, required: true }
});

/** Schema of the details about the oxygen measure. */
const oxygen = new Schema({
    _id       : false,
    multiple  : { type: Boolean, required: true },
    val       : { type: [{ depth: Number, concentration: Number, percentage: Number }], required: true },
    instrument: { type: instrument, required: true }
});

/** Schema of the details about the bacteria measure. */
const bacteria = new Schema({
    _id            : false,
    escherichiaColi: { type: Number, required: false },
    enterococci    : { type: Number, required: false },
    instrument     : { type: instrument, required: true }
});

/** Schema of the observation measures. */
const measures = new Schema({
    _id         : false,
    transparency: transparency,
    temperature : temperature,
    ph          : ph,
    oxygen      : oxygen,
    bacteria    : bacteria,
});


/** Schema of an observation. */
const schema = new Schema({
    uid              : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    position         : { type: position, required: true },
    weather          : { type: weather, required: true },
    details          : { type: details, required: true },
    photos           : { type: [String], required: true },
    measures         : { type: measures, required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
