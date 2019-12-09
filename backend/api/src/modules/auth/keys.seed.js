import Key, { collection } from "./keys.model";
import { dropCollection } from "../../setup/seeder";


export default async function () {

    console.info("SEED - Keys...");

    await dropCollection(collection);

    const keys = [{ key: "testApiKey" }];

    for (const key of keys) await Key.create(key);

}

