import Key, { collection } from "./key.model";
import { dropCollection } from "../../setup/seeder";


export default async function () {

    console.info("SEED - Key...");

    await dropCollection(collection);

    console.log("Dropped");

    const keys = [{ key: "testApiKey" }];

    for (const key of keys) await Key.create(key);

}

