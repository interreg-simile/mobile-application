/**
 * @fileoverview This file populates the Rois collection with real data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

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

    // Create the dummy data
    const rois = [];

    // Save the rois
    for (const roi of rois) await Roi.create(roi);

}
