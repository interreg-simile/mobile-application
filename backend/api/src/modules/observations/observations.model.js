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
    crs        : { type: { code: Number }, required: true },
    accuracy   : { type: Number, required: false },
    roi        : { type: mongoose.Schema.Types.ObjectId, ref: Rois, required: false },
});


/** Schema of the weather. */
const weather = new Schema({
    _id        : false,
    temperature: { type: Number, required: false },
    sky        : { type: { code: Number }, required: true },
    wind       : { type: Number, required: false }
});


/** Schema of an observation. */
const schema = new Schema({
    // uid              : { type: Schema.Types.ObjectId, ref: User, required: true },
    position         : { type: position, required: true },
    weather          : { type: weather, required: true },
    details          : { type: Schema.Types.Mixed, required: false },
    measures         : { type: Schema.Types.Mixed, required: false },
    other            : { type: String, required: false },
    photos           : { type: [String], required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
