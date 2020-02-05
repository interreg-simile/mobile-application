/**
 * @fileoverview This file contains the Mongoose model for an event.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose, { Schema } from "mongoose";

import { point } from "../../utils/common-schemas";
import { collection as User } from "../users/user.model";


/** Name of the collection. */
export const collection = "Events";


/** Schema of an address. */
const address = new Schema({
    _id       : false,
    main      : { type: String, required: true },
    civic     : { type: String, required: true },
    city      : { type: String, required: true },
    postalCode: { type: Number, required: true },
    province  : { type: String, required: true },
    country   : { type: { _id: false, code: Number }, required: true }
});


/** Schema of the contacts. */
const contacts = new Schema({
    _id  : false,
    mail : String,
    phone: String
});


/** Schema of an event. */
const schema = new Schema({
    uid              : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    titleIta         : { type: String, required: true },
    titleEng         : { type: String, required: false },
    descriptionIta   : { type: String, required: true },
    descriptionEng   : { type: String, required: false },
    position         : { type: point, required: true },
    address          : { type: address, required: true },
    rois             : { type: { _id: false, codes: [Number] }, required: true },
    date             : { type: Date, required: true },
    cover            : { type: String, required: true },
    contacts         : { type: contacts, required: true },
    participants     : { type: Number, required: false },
    photos           : { type: [String], required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
