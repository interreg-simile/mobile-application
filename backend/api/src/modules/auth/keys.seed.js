/**
 * @fileoverview This file populates the ApiKeys collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import Key, { collection } from "./keys.model";
import { dropCollection } from "../../setup/seeder";


/**
 * Drops the ApiKey collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Keys...");

    // Drop the collection
    await dropCollection(collection);

    // Create the dummy data
    const keys = [
        {
            key        : "testApiKey",
            description: "Dummy key for testing purposes."
        }
    ];

    // Populate the collection
    for (const key of keys) await Key.create(key);

}

