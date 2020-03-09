/**
 * @fileoverview This file populates the Alerts collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { LoremIpsum } from "lorem-ipsum";

import Alert, { collection } from "./alerts.model";
import { dropCollection } from "../../setup/seeder";
import User from "../users/user.model";


/**
 * Drops the Alerts collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Alerts...");

    // Drop the collection
    await dropCollection(collection);

    // Create the dummy data
    const alerts = [
        {
            uid    : "5dd7bbe0701d5bdd685c1f17",
            title  : { it: "Comunicazione 1", en: "Communication 1" },
            content: { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            dateEnd: new Date().setMonth(new Date().getMonth() + 1)
        },
        {
            uid    : "5dd7bbe0701d5bdd685c1f17",
            title  : { it: "Comunicazione 2", en: "Communication 2" },
            content: { it: new LoremIpsum().generateParagraphs(1), en: new LoremIpsum().generateParagraphs(1) },
            dateEnd: new Date().setMonth(new Date().getMonth() + 3)
        }
    ];

    // Retrieve the id of the admin
    const adminId = await User.findOne({ email: "admin@example.com" }, "_id");

    // For each dummy data
    for (const alert of alerts) await Alert.create(alert);

}
