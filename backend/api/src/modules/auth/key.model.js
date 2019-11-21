import mongoose, { Schema } from "mongoose";

export const collection = "ApiKey";

const schema = new Schema({
    key: { type: String, required: true, index: true }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
