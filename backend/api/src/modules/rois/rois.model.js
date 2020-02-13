/**
 * @fileoverview This file contains the Mongoose model for a region of interest.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { polygon } from "../../utils/common-schemas";


/** Name of the collection. */
export const collection = "Rois";


/** Schema of a region of interest. */
const schema = new Schema({
    country : { type: { _id: false, code: Number }, required: true },
    area    : { type: { _id: false, code: Number }, required: true },
    lake    : { type: { _id: false, code: Number }, required: true },
    geometry: { type: polygon, required: true }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
