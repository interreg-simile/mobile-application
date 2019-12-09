import { LoremIpsum } from "lorem-ipsum";

import Communication, { collection } from "./communications.model";
import { dropCollection } from "../../setup/seeder";
import { roiEnum } from "../../utils/common-validations";


export default async function () {

    console.info("SEED - Communications...");

    await dropCollection(collection);

    const communications = [
        {
            titleIta      : "Titolo della comunicazione",
            titleEng      : "Title of the communication",
            descriptionIta: new LoremIpsum().generateParagraphs(1),
            descriptionEng: new LoremIpsum().generateParagraphs(1),
            dateStart     : new Date("2019-12-08T00:00:00"),
            dateEnd       : new Date("2020-01-30T00:00:00"),
            rois          : ["lake_como"],
        }
    ];

    for (const communication of communications) await Communication.create(communication);

}
