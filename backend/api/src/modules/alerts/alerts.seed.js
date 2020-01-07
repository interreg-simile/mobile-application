import { LoremIpsum } from "lorem-ipsum";

import Alert, { collection } from "./alerts.model";
import { dropCollection } from "../../setup/seeder";


export default async function () {

    console.info("SEED - Alerts...");

    await dropCollection(collection);

    const alerts = [
        {
            titleIta  : "Comunicazione 1",
            titleEng  : "Communication 1",
            contentIta: new LoremIpsum().generateParagraphs(1),
            contentEng: new LoremIpsum().generateParagraphs(1),
            dateStart : new Date("2020-01-08T00:00:00"),
            dateEnd   : new Date("2020-12-30T00:00:00"),
            rois      : ["lake_como"],
        },
        {
            titleIta  : "Comunicazione 2",
            titleEng  : "Communication 2",
            contentIta: new LoremIpsum().generateParagraphs(1),
            contentEng: new LoremIpsum().generateParagraphs(1),
            dateStart : new Date("2020-10-09T00:00:00"),
            dateEnd   : new Date("2020-12-30T00:00:00"),
            rois      : ["lake_maggiore", "lake_como", "lake_lugano"],
        }
    ];

    for (const alert of alerts) await Alert.create(alert);

}
