/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import mongoose from "mongoose"
import { MONGO_URL } from "./env"


/**
 * Connects to the MongoDB database.
 *
 * @returns {Promise<void>} An empty promise.
 */
export default async function () {

    console.info("SETUP - Connecting database...");

    // Connect to the database
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser   : true,  // Use the new MongoDB connection string parser (the old one is deprecated)
        useCreateIndex    : true,  // Use createIndex() to build Mongoose's default index (ensureIndex() is deprecated)
        useUnifiedTopology: true   // Use MongoDB drive's new connection management engine
    });

}
