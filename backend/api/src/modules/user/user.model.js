import mongoose, { Schema } from "mongoose";

export const collection = "User";

const schema = new Schema({
    _id        : { type: String },
    email      : { type: String, unique: true, required: true },
    password   : { type: String, required: true },
    role       : { type: String, required: true, default: "user" },
    isConfirmed: { type: Boolean, required: true, default: false },
    name       : { type: String, required: true },
    city       : { type: String, required: true },
    cap        : { type: String, required: true },
    age        : { type: String },
    gender     : { type: String },
    image      : { type: String }
}, { timestamps: true, _id: false });

export default mongoose.model(collection, schema, collection);
