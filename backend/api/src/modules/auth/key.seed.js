import Key from "./key.model";

export default async function () {

    console.info("SEED - Key...");

    const keys = [{ key: "testApiKey" }];

    for (const key of keys) await Key.create(key);

}

