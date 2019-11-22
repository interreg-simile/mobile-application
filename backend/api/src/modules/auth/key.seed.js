import mongoose from "mongoose";

import { NODE_ENV } from "../../config/env";
import Key, { collection } from "./key.model";

export default async function () {

    console.info("SEED - Key...");

    // If the program is running in development mode, clear the collection
    if (NODE_ENV === "development") await mongoose.connection.dropCollection(collection);

    const keys = [{ key: "testApiKey" }];

    for (const key of keys) await Key.create(key);

}

