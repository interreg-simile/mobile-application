import { Schema } from "mongoose";


/** Schema of a point. */
export const point = new Schema({
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }
});
