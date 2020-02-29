/**
 * @fileoverview This file populates the Observations collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { dropCollection } from "../../setup/seeder";
import Observation, { collection } from "./observations.model";
import User from "../users/user.model";
import Roi from "../rois/rois.model";


/**
 * Drops the Observations collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Observations...");

    // Drop the collection
    await dropCollection(collection);

    // Create the dummy data
    const observations = [
        {
            uid     : "5dd7bbe0701d5bdd685c1f19", // User 2
            position: {
                coordinates: [9.079017, 45.824735],
                accuracy   : 20.86549,
                custom     : false,
                roi        : "000000000000000000000001"
            },
            weather : { temperature: 25.8, sky: { code: 1 }, wind: 32 },
            details : {
                algae: {
                    extension : { code: 1 },
                    look      : { code: 2 },
                    colour    : { code: 1 },
                    iridescent: false
                }
            },
            photos  : ["observations/default.jpg"]
        },
        {
            uid     : "5dd7bbe0701d5bdd685c1f18", // User 1
            position: {
                coordinates: [9.102516, 45.861128],
                accuracy   : 20.86549,
                custom     : true,
                roi        : "000000000000000000000001"
            },
            weather : { temperature: 25.8, sky: { code: 3 } },
            details : {
                odours: { intensity: { code: 2 }, origin: [{ code: 1 }, { code: 3 }] }
            },
            measures: {
                ph: { multiple: false, val: [{ depth: 1, val: 7 }], instrument: { type: { code: 1 }, precision: 1 } }
            },
            photos  : ["observations/default.jpg"]
        }
    ];

    // Save the dummy data
    for (const obs of observations) await Observation.create(obs);

}
