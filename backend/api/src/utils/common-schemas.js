import mongoose, { Schema } from "mongoose";

/** Schema for a point. */
export const point = new mongoose.Schema({
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }
});
