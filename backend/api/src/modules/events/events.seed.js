/**
 * @fileoverview This file populates the Events collection with dummy data.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { LoremIpsum } from "lorem-ipsum";

import Event, { collection } from "./events.model";
import { dropCollection } from "../../setup/seeder";
import User from "../users/user.model";


/**
 * Drops the Events collection and re-populates it with dummy data.
 *
 * @return {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SEED - Events...");

    // Drop the collection
    await dropCollection(collection);

    // Create the dummy data
    const events = [
        {
            titleIta      : "Evento futuro",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [45.912573, 8.504056] },
            address       : {
                main      : "Corso Giuseppe Garibaldi",
                civic     : "23",
                city      : "baveno",
                postalCode: 28831,
                province  : "vb",
                country   : { code: [1] }
            },
            rois          : { codes: [1] },
            date          : new Date("2020-12-30T15:24:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it", phone: "+393349969525" }
        },
        {
            titleIta      : "Evento futuro 2",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [45.852352, 9.389224] },
            address       : {
                main      : "Largo Fratelli Calvi",
                civic     : "2",
                city      : "lecco",
                postalCode: 23900,
                province  : "lc",
                country   : { code: 2 }
            },
            rois          : { codes: [2, 3] },
            date          : new Date("2020-10-13T09:10:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it" }
        }
    ];

    // Retrieve the id of the admin
    const adminId = await User.findOne({ email: "admin@example.com" }, "_id");

    // For each dummy data
    for (const event of events) {

        // Save the admin id as uid
        event.uid = adminId;

        // Save the event
        await Event.create(event);

    }

}
