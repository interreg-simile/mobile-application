/**
 * @fileoverview This file contains the Mongoose model for an API key.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";


/** Name of the collection. */
export const collection = "ApiKeys";


/** Schema of an API key. */
const schema = new Schema({
    key        : { type: String, required: true, index: true, unique: true },
    description: { type: String, required: true }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
