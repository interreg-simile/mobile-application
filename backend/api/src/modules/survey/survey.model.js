import mongoose, { Schema } from "mongoose";

import { collection as User } from "../user/user.model";

export const collection = "Survey";

const completedBySchema = new Schema({
    // uid : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    uid : { type: String, required: true },
    date: { type: Date, required: true }
});

const schema = new Schema({
    title      : { type: String, required: true },
    etc        : { type: String, required: true },
    area       : { type: String, required: true },
    completedBy: [completedBySchema],
    expireDate : { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
