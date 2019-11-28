import mongoose, { Schema } from "mongoose";

import { point } from "../utils/common-schemas";


export const collection = "Event";

const address = new Schema({
    main    : { type: String, required: true },
    cn      : { type: String, required: true },
    city    : { type: String, required: true },
    cap     : { type: Number, required: true },
    province: { type: String, required: true },
    country : { type: String, enum: ["Italy", "Switzerland"], required: true }
});

const schema = new Schema({
    title            : { type: String, required: true },
    descriptionEng   : { type: String, required: true },
    descriptionIta   : { type: String, required: false },
    position         : { type: point, required: true },
    address          : { type: address, required: true },
    date             : { type: Date, required: true },
    imageUrl         : { type: String, required: false },
    participants     : { type: Number, required: false },
    markedForDeletion: { type: Boolean, required: true, default: false }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
