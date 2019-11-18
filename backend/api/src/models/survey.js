import mongoose, { Schema } from "mongoose";

export const collection = "Survey";

const schema = new Schema({
    title: {
        type    : String,
        required: true
    },
    etc  : {
        type    : String,
        required: true
    },
    area : {
        type    : String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
