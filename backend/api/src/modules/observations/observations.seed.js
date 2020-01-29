import { dropCollection } from "../../setup/seeder";
import Observation, { collection } from "./observations.model";
import User from "../users/user.model";


export default async function () {

    console.info("SEED - Observations...");

    await dropCollection(collection);

    const observations = [
        {
            position: {
                coordinates: [45.824735, 9.079017],
                accuracy   : 20.86549,
                custom     : false,
                address    : "Piazzetta Felice Baratelli 22100 Como CO",
                lake       : { code: 3 }
            },
            weather : {
                temperature: 25.8,
                sky        : { code: 1 },
                wind       : 32
            },
            details : {
                algae  : { extension: { code: 1 }, look: { code: 2 } },
                oils   : {},
                outlets: { inPlace: true, terminal: { code: 1 }, signage: false }
            },
            photos  : ["observations/default.jpg"]
        },
        {
            position: {
                coordinates: [45.824735, 9.079017],
                accuracy   : 20.86549,
                custom     : false,
                address    : "Piazzetta Felice Baratelli 22100 Como CO",
                lake       : { code: 3 }
            },
            weather : {
                temperature: 25.8,
                sky        : { code: 1 },
                wind       : 32
            },
            details : {
                algae  : { extension: { code: 1 }, look: { code: 2 } },
                oils   : {},
                outlets: { inPlace: true, terminal: { code: 1 }, signage: false }
            },
            photos  : ["observations/default.jpg"]
        }
    ];

    const userId = await User.findOne({ email: "user1@example.com" }, "_id");

    for (const obs of observations) {

        obs.uid = userId;

        await Observation.create(obs);

    }

}
