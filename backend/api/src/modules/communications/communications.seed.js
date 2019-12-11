import { LoremIpsum } from "lorem-ipsum";

import Communication, { collection } from "./communications.model";
import { dropCollection } from "../../setup/seeder";
import { roiEnum } from "../../utils/common-validations";


export default async function () {

    console.info("SEED - Communications...");

    await dropCollection(collection);

    const communications = [
        {
            titleIta      : "Comunicazione 1",
            titleEng      : "Communication 1",
            contentIta: new LoremIpsum().generateParagraphs(1),
            contentEng: new LoremIpsum().generateParagraphs(1),
            dateStart     : new Date("2019-12-08T00:00:00"),
            dateEnd       : new Date("2020-01-30T00:00:00"),
            rois          : ["lake_como"],
        },
        {
            titleIta      : "Comunicazione 2",
            titleEng      : "Communication 2",
            contentIta: new LoremIpsum().generateParagraphs(1),
            contentEng: new LoremIpsum().generateParagraphs(1),
            dateStart     : new Date("2019-10-09T00:00:00"),
            dateEnd       : new Date("2019-12-30T00:00:00"),
            rois          : ["lake_maggiore"],
        }
    ];

    for (const communication of communications) await Communication.create(communication);

}
