import { Schema } from "mongoose";


/** Schema of a point. */
export const point = new Schema({
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }
});


/**
 * Generates the schema for a "dCode" property.
 *
 * @param {Number} min - The minimum allowed code.
 * @param {Number} max - The maximum allowed code.
 * @param {String} path - The path to the field.
 * @return {Object} The schema.
 */
export function genDCode(min, max, path) {

    return {
        code: { type: Number, min: 1, max: 4 },
        path: { type: String, default: function () { return this.code ? path : undefined}, immutable: true }
    }

}
