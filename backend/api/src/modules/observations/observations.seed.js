/**
 * @fileoverview This file populates the Observations collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { dropCollection } from "../../setup/seeder";
import Observation, { collection } from "./observations.model";
import User from "../users/user.model";


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
            position: {
                coordinates: [45.824735, 9.079017],
                accuracy   : 20.86549,
                custom     : false,
                address    : "Piazzetta Felice Baratelli 22100 Como CO",
                lake       : { dCode: { code: 3, path: "observations.position.lake" } }
            },
            weather : {
                temperature: 25.8,
                sky        : { dCode: { code: 1, path: "weather.sky" } },
                wind       : 32
            },
            details : {
                algae  : {
                    extension: { dCode: { code: 1, path: "observations.details.algae.extension" } },
                    look     : { dCode: { code: 2, path: "observations.details.algae.look" } }
                },
                oils   : {},
                outlets: { inPlace: true, colour: { dCode: { code: 1, path: "observations.details.outlets.colour" } } }
            },
            photos  : ["observations/default.jpg"]
        }
    ];

    // Retrieve the id of a user
    const userId = await User.findOne({ email: "user1@example.com" }, "_id");

    // For each dummy data
    for (const obs of observations) {

        // Save the user id as uid
        obs.uid = userId;

        // Save the observation
        await Observation.create(obs);

    }

}
