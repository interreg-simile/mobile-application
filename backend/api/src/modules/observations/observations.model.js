/**
 * @fileoverview This file contains the Mongoose model for an observation.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";
import { collection as Rois } from "../rois/rois.model";
import { genDCode } from "../../utils/common-schemas";


/** Name of the collection. */
export const collection = "Observations";


/** Schema of a the observation position. */
const position = new Schema({
    _id        : false,
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
    accuracy   : { type: Number, required: false },
    custom     : { type: Boolean, required: true },
    roi        : { type: mongoose.Schema.Types.ObjectId, ref: Rois, required: false },
});


/** Schema of the weather. */
const weather = new Schema({
    _id        : false,
    temperature: { type: Number, required: false },
    sky        : { type: { code: Number }, required: true },
    wind       : { type: Number, required: false }
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
    uid              : { type: Schema.Types.ObjectId, ref: User, required: true },
    position         : { type: position, required: true },
    weather          : { type: weather, required: true },
    details          : { type: Schema.Types.Mixed, required: false },
    photos           : { type: [String], required: false },
    measures         : { type: measures, required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
