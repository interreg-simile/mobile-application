import mongoose, { Schema } from "mongoose";

import { collection as User } from "../user/user.model";

export const collection = "Survey";

const completedBySchema = new Schema({
    uid : { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    date: { type: Date, required: true }
});

const schema = new Schema({
    titleIta   : { type: String, required: true },
    titleEng   : { type: String },
    etc        : { type: String, required: true },
    area       : { type: String },
    completedBy: [completedBySchema]
}, { timestamps: true });

export default mongoose.model(collection, schema, collection);
