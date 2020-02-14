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
                lake       : { code: 1, dPath: "position.lake" }
            },
            weather : {
                temperature: 25.8,
                sky        : { code: 1, dPath: "weather.sky" },
                wind       : 32
            },
            details : {
                algae: {
                    extension: { code: 1, dPath: "details.algae.extension" },
                    look     : { code: 2, dPath: "details.algae.look" },
                    colour   : { code: 1, dPath: "details.algae.colour", iridescent: false }
                }
            },
            photos  : ["observations/default.jpg"]
        },
        // {
        //     position: {
        //         coordinates: [46.824735, 9.079017],
        //         accuracy   : 20.86549,
        //         custom     : false,
        //         address    : "Piazzetta Felice Baratelli 22100 Como CO",
        //         lake       : { code: 2, dPath: "position.lake" }
        //     },
        //     weather : {
        //         temperature: 25.8,
        //         sky        : { code: 3, dPath: "weather.sky" },
        //         wind       : 32
        //     },
        //     details : {
        //         litters: {
        //             quantity: { code: 1, dPath: "details.litters.quantity" },
        //             type    : [
        //                 { code: 1, dPath: "details.litters.type" },
        //                 { code: 2, dPath: "details.litters.type" }
        //             ]
        //         }
        //     },
        //     photos  : ["observations/default.jpg"]
        // }
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
