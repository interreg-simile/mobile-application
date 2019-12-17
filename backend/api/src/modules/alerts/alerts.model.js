import mongoose, { Schema } from "mongoose";

import { e } from "../../utils/common-validations";


/** Name of the collection. */
export const collection = "Alerts";


/** Schema of the resource. */
const schema = new Schema({
    titleIta         : { type: String, required: true },
    titleEng         : { type: String, required: false },
    contentIta       : { type: String, required: true },
    contentEng       : { type: String, required: false },
    dateStart        : { type: Date, required: true },
    dateEnd          : { type: Date, required: true },
    rois             : { type: [{ type: String, enum: e.roi }], required: true },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: false });

export default mongoose.model(collection, schema, collection);
