import { LoremIpsum } from "lorem-ipsum";

import Event, { collection } from "./event.model";
import { dropCollection } from "../../setup/seeder";

export default async function () {

    console.info("SEED - Event...");

    await dropCollection(collection);

    const events = [
        {
            title         : "Past event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main    : "Largo Fratelli Calvi",
                cn      : "2",
                city    : "Lecco",
                cap     : 23900,
                province: "Lecco",
                country : "Italy"
            },
            date          : new Date("2019-09-13T09:10:00")
        },
        {
            title         : "Event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.077134, 45.823060] },
            address       : {
                main    : "Viale Geno",
                cn      : "17",
                city    : "Como",
                cap     : 22100,
                province: "Como",
                country : "Italy"
            },
            date          : new Date("2019-12-30T15:24:00")
        },
        {
            title         : "Past event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main    : "Largo Fratelli Calvi",
                cn      : "2",
                city    : "Lecco",
                cap     : 23900,
                province: "Lecco",
                country : "Italy"
            },
            date          : new Date("2019-09-13T09:10:00")
        },
        {
            title         : "Middle event title",
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            position      : { type: "Point", coordinates: [9.383572, 45.860125] },
            address       : {
                main    : "Largo Fratelli Calvi",
                cn      : "2",
                city    : "Lecco",
                cap     : 23900,
                province: "Lecco",
                country : "Italy"
            },
            date          : new Date("2019-10-13T09:10:00")
        }
    ];

    for (const event of events) {
        const e = await Event.create(event);
        // console.log(e);
    }

}
