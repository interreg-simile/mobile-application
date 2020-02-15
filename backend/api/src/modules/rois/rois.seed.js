/**
 * @fileoverview This file populates the Rois collection with real data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import fs from "fs";

import Roi, { collection } from "./rois.model";
import { dropCollection } from "../../setup/seeder";


/**
 * Drops the Rois collection and re-populates it with real data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Rois...");

    // Drop the collection
    await dropCollection(collection);

    // Initialize the rois array
    const rois = [];

    // Load all the json files in the "./data" folder
    fs.readdirSync(path.resolve(__dirname, "data")).forEach(file => rois.push(require(`./data/${file}`)));

    // Save the rois
    for (const roi of rois) await Roi.create(roi);

}
