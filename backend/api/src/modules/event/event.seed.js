import { LoremIpsum } from "lorem-ipsum";

import Event, { collection } from "./event.model";
import { dropCollection } from "../../setup/seeder";


export default async function () {

    console.info("SEED - Event...");

    await dropCollection(collection);

    const events = [
        {
            title         : "Event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.077134, 45.823060] },
            address       : {
                main      : "Viale Geno",
                civic     : "17",
                city      : "como",
                postalCode: 22100,
                province  : "co",
                country   : "italy"
            },
            rois          : ["lake_como"],
            date          : new Date("2019-12-30T15:24:00")
        },
        {
            title         : "Past event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
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
            date          : new Date("2019-09-13T09:10:00")
        },
        {
            title         : "Middle event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main      : "Largo Fratelli Calvi",
                civic     : "2",
                city      : "lecco",
                postalCode: 23900,
                province  : "lc",
                country   : "italy"
            },
            rois          : ["lake_maggiore", "lake_lugano"],
            date          : new Date("2019-10-13T09:10:00")
        },
        {
            title            : "Deleted event",
            descriptionEng   : new LoremIpsum().generateParagraphs(1),
            descriptionIta   : new LoremIpsum().generateParagraphs(1),
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
            markedForDeletion: true
        }
    ];

    for (const event of events) await Event.create(event);

}
