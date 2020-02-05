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
            titleIta  : "Comunicazione 1",
            contentIta: new LoremIpsum().generateParagraphs(1),
            dateStart : new Date("2020-01-08T00:00:00"),
            dateEnd   : new Date("2020-12-30T00:00:00"),
            rois      : { codes: [1] },
        },
        {
            titleIta  : "Comunicazione 2",
            contentIta: new LoremIpsum().generateParagraphs(1),
            dateStart : new Date("2020-10-09T00:00:00"),
            dateEnd   : new Date("2020-12-30T00:00:00"),
            rois      : { codes: [2,3] },
        }
    ];

    // Retrieve the id of the admin
    const adminId = await User.findOne({ email: "admin@example.com" }, "_id");

    // For each dummy data
    for (const alert of alerts) {

        // Save the admin id as uid
        alert.uid = adminId;

        // Save the alert
        await Alert.create(alert);

    }

}
