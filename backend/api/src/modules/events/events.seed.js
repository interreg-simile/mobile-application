import { LoremIpsum } from "lorem-ipsum";

import Event, { collection } from "./events.model";
import { dropCollection } from "../../setup/seeder";
import User from "../users/user.model";


export default async function () {

    console.info("SEED - Events...");

    await dropCollection(collection);

    const events = [
        {
            titleIta      : "Evento futuro",
            titleEng      : "Future event",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [5.909484, 8.505565] },
            address       : {
                main      : "Corso Giuseppe Garibaldi",
                civic     : "23",
                city      : "baveno",
                postalCode: 28831,
                province  : "vb",
                country   : "italy"
            },
            rois          : ["lake_maggiore"],
            date          : new Date("2020-12-30T15:24:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it", phone: "+393349969525" }
        },
        {
            titleIta      : "Evento futuro 2",
            titleEng      : "Future event 2",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main      : "Largo Fratelli Calvi",
                civic     : "2",
                city      : "lecco",
                postalCode: 23900,
                province  : "lc",
                country   : "italy"
            },
            rois          : ["lake_como"],
            date          : new Date("2020-10-13T09:10:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it" }
        },
        {
            titleIta      : "Evento passato senza foto",
            titleEng      : "Past event without photos",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main      : "Largo Fratelli Calvi",
                civic     : "2",
                city      : "lecco",
                postalCode: 23900,
                province  : "lc",
                country   : "italy"
            },
            rois          : ["lake_maggiore"],
            date          : new Date("2019-09-13T09:10:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it", phone: "+393349969525" }
        },
        {
            titleIta      : "Evento passato con foto",
            titleEng      : "Past event without photos",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [45.903938, 8.899005] },
            address       : {
                main      : "Via degli Alpini",
                civic     : "2",
                city      : "porto ceresio",
                postalCode: 21050,
                province  : "va",
                country   : "italy"
            },
            rois          : ["lake_lugano"],
            date          : new Date("2019-12-13T09:10:00"),
            cover         : "events/default.jpg",
            contacts      : { mail: "info@simile.it", phone: "+393349969525" },
            participants  : 120,
            photos        : ["events/photo_1.jpg", "events/photo_2.jpg", "events/photo_3.jpg"]
        },
        {
            titleIta         : "Evento cancellato",
            titleEng         : "Deleted event",
            descriptionIta   : new LoremIpsum().generateParagraphs(1),
            descriptionEng   : new LoremIpsum().generateParagraphs(1),
            position         : { type: "Point", coordinates: [9.383572, 45.860125] },
            address          : {
                main      : "Largo Fratelli Calvi",
                civic     : "2",
                city      : "lecco",
                postalCode: 23900,
                province  : "lc",
                country   : "italy"
            },
            rois             : ["lake_como"],
            date             : new Date("2020-10-13T09:10:00"),
            cover            : "events/default.jpg",
            contacts         : { mail: "info@simile.it", phone: "+393349969525" },
            markedForDeletion: true
        }
    ];

    const adminId = await User.findOne({ email: "admin@example.com" }, "_id");

    for (const event of events) {

        event.uid = adminId;

        await Event.create(event);

    }

}
