import mongoose, { Schema } from "mongoose";

export const collection = "Survey";

const schema = new Schema({
    titleIta: {
        type    : String,
        required: true
    },
    titleEng: String,
    etc     : {
        type    : String,
        required: true
    },
    area    : String
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
