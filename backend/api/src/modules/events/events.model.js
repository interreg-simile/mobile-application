import mongoose, { Schema } from "mongoose";

import { point } from "../../utils/common-schemas";
import { e } from "../../utils/common-validations";


export const collection = "Events";

const address = new Schema({
    main      : { type: String, required: true },
    civic     : { type: String, required: true },
    city      : { type: String, lowercase: true, required: true },
    postalCode: { type: Number, required: true },
    province  : { type: String, lowercase: true, required: true },
    country   : { type: String, enum: e.county, required: true }
});

const schema = new Schema({
    titleIta         : { type: String, required: true },
    titleEng         : { type: String, required: false },
    descriptionIta   : { type: String, required: true },
    descriptionEng   : { type: String, required: false },
    position         : { type: point, required: true },
    address          : { type: address, required: true },
    rois             : { type: [{ type: String, enum: e.roi }], required: true },
    date             : { type: Date, required: true },
    imageUrl         : { type: String, required: false },
    participants     : { type: Number, required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: false });

export default mongoose.model(collection, schema, collection);
