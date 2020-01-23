import mongoose, { Schema } from "mongoose";

import { point } from "../../utils/common-schemas";
import { enums } from "../../utils/common-validations";
import { collection as User } from "../users/user.model";


/** Name of the collection. */
export const collection = "Events";


/** Schema of an address. */
const address = new Schema({
    main      : { type: String, required: true },
    civic     : { type: String, required: true },
    city      : { type: String, lowercase: true, required: true },
    postalCode: { type: Number, required: true },
    province  : { type: String, lowercase: true, required: true },
    country   : { type: String, enum: enums.county, required: true }
});


/** Schema of the contacts. */
const contacts = new Schema({
    mail : { type: String, required: false },
    phone: { type: String, required: false }
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
    rois             : { type: [{ type: String, enum: enums.roi }], required: true },
    date             : { type: Date, required: true },
    cover            : { type: String, required: true },
    contacts         : { type: contacts, required: false },
    participants     : { type: Number, required: false },
    photos           : { type: [String], required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
