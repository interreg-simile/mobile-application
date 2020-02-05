/**
 * @fileoverview This file contains common Mongoose schemas.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { Schema } from "mongoose";
import yaml from "yamljs";
import path from "path";


// Load the models configuration in JSON format
const conf = yaml.load(path.resolve("./src/config/models.yaml"));


/** Schema of a point. */
export const point = new Schema({
    type       : { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }
});


/**
 * Generates the schema for a "dCode" property.
 *
 * @param {String} path - The path to the field in the modes configuration file in form "model:path".
 * @return {Object} The schema.
 */
export function genDCode(path) {

    // Get the right configuration
    const c = conf[path.split(":")[0]];

    // Save the resource path
    const p = `${path.split(":")[0]}.${path.split(":")[1]}`;

    // Return the schema
    return {
        code: { type: Number, min: c.min, max: c.max },
        path: {
            type     : String,
            default  : function () { return this.code ? p : undefined},
            immutable: true
        }
    }

}
