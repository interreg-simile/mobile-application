/**
 * @fileoverview This file contains the Mongoose model for an observation.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";
import { genDCode } from "../../utils/common-schemas";


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
    lake       : { type: genDCode("observations:position.lake"), required: true }
});


/** Schema of the weather. */
const weather = new Schema({
    _id        : false,
    temperature: { type: Number, required: true },
    sky        : { type: genDCode("observations:weather.sky"), required: true },
    wind       : { type: Number, required: true }
});


/** Schema of the details about algae. */
const algae = new Schema({
    _id      : false,
    extension: genDCode("observations:details.algae.extension"),
    look     : genDCode("observations:details.algae.look"),
    colour   : { ...genDCode("observations:details.algae.colour"), iridescent: Boolean }
});

/** Schema of the details about foams. */
const foams = new Schema({
    _id      : false,
    extension: genDCode("observations:details.foams.extension"),
    look     : genDCode("observations:details.foams.look"),
    height   : genDCode("observations:details.foams.height")
});

/** Schema of the details about oils. */
const oils = new Schema({
    _id      : false,
    extension: genDCode("observations:details.oils.extension"),
    type     : genDCode("observations:details.oils.type")
});

/** Schema of the details about litter. */
const litters = new Schema({
    _id     : false,
    quantity: genDCode("observations:details.litters.quantity"),
    type    : [{ _id: false, ...genDCode("observations:details.litters.type") }]
});

/** Schema of the details about odours. */
const odours = new Schema({
    _id      : false,
    intensity: genDCode("observations:details.odours.intensity"),
    origin   : [{ _id: false, ...genDCode("observations:details.odours.origin") }]
});

/** Schema of the details about outlets. */
const outlets = new Schema({
    _id                 : false,
    inPlace             : Boolean,
    terminal            : genDCode("observations:details.outlets.terminal"),
    colour              : genDCode("observations:details.outlets.colour"),
    vapour              : Boolean,
    signage             : Boolean,
    signagePhoto        : String,
    prodActNearby       : Boolean,
    prodActNearbyDetails: String
});

/** Schema of the details about the fauna. */
const fauna = new Schema({
    _id         : false,
    deceased    : { fish: Boolean, birds: Boolean, other: String },
    abnormal    : { fish: Boolean, birds: Boolean, other: String, description: String },
    alienSpecies: {
        crustaceans: { present: Boolean, details: String },
        molluscs   : { present: Boolean, details: String },
        turtles    : { present: Boolean, details: String },
        fish       : { present: Boolean, details: String },
        birds      : { present: Boolean, details: String },
        other      : String
    }
});

/** Schema of the observation details. */
const details = new Schema({
    _id    : false,
    algae  : algae,
    foams  : Schema.Types.Mixed,
    oils   : oils,
    litters: litters,
    odours : odours,
    outlets: outlets,
    fauna  : fauna,
    other  : String
});


/** Schema of an instrument. */
const instrument = new Schema({
    _id         : false,
    professional: { type: Boolean, required: true },
    brand       : { type: String, required: false },
    precision   : { type: String, required: false },
    details     : { type: String, required: false }
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
    enterococci    : { type: Number, required: false }
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
    details          : { type: details, required: false },
    photos           : { type: [String], required: true },
    measures         : { type: measures, required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
