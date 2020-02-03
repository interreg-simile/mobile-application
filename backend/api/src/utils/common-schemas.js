import { Schema } from "mongoose";
import yaml from "yamljs";
import path from "path";


// Load the configurations in JSON format
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

    const c = conf[path.split(":")[0]];

    return {
        code: { type: Number, min: c.min, max: c.max },
        path: {
            type     : String,
            default  : function () { return this.code ? path.split(":")[1] : undefined},
            immutable: true
        }
    }

}
