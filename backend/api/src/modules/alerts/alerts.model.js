import mongoose, { Schema } from "mongoose";

import { enums } from "../../utils/common-validations";
import { collection as User } from "../users/user.model";


/** Name of the collection. */
export const collection = "Alerts";


/** Schema of the resource. */
const schema = new Schema({
    uid              : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    titleIta         : { type: String, required: true },
    titleEng         : { type: String, required: false },
    contentIta       : { type: String, required: true },
    contentEng       : { type: String, required: false },
    dateStart        : { type: Date, required: true },
    dateEnd          : { type: Date, required: true },
    rois             : { type: [{ type: String, enum: enums.roi }], required: true },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });


/** Exports the schema. */
export default mongoose.model(collection, schema, collection);
