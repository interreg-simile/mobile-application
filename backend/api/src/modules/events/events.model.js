/**
 * @fileoverview This file contains the Mongoose model for an event.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { collection as User } from "../users/user.model";
import { collection as Roi } from "../rois/rois.model";


/** Name of the collection. */
export const collection = "Events";


/** Schema of the position. */
const position = new Schema({
    _id        : false,
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
    address    : { type: String, required: true },
    city       : { type: String, required: true }
});


/** Schema of the contacts. */
const contacts = new Schema({
    _id  : false,
    email: String,
    phone: String
});


/** Schema of an event. */
const schema = new Schema({
    uid              : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    title            : { type: Schema.Types.Mixed, required: true },
    description      : { type: Schema.Types.Mixed, required: true },
    position         : { type: position, required: true },
    date             : { type: Date, required: true },
    contacts         : { type: contacts, required: true },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
