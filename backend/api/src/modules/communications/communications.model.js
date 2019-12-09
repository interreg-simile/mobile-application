import mongoose, { Schema } from "mongoose";

import { e } from "../../utils/common-validations";


/** Name of the collection. */
export const collection = "Communications";


/** Schema of the resource. */
const schema = new Schema({
    titleIta         : { type: String, required: true },
    titleEng         : { type: String, required: false },
    descriptionIta   : { type: String, required: true },
    descriptionEng   : { type: String, required: false },
    dateStart        : { type: Date, required: true },
    dateEnd          : { type: Date, required: true },
    rois             : { type: [{ type: String, enum: e.roi }], required: true },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: false });

export default mongoose.model(collection, schema, collection);
