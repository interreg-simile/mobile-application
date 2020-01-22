import mongoose from "mongoose"

import { MONGO_URL } from "../config/env"


/**
 * Connects to the database.
 *
 * @returns {Promise<void>}
 */
export default async function () {

    console.info("SETUP - Connecting database...");

    // Try to connect
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser   : true,
        useCreateIndex    : true,
        useFindAndModify  : false,
        useUnifiedTopology: true
    });

}

/**
 * Handles any connection error.
 *
 * @param {Error} error - The error object.
 */
export function onDbConnectionError(error) { console.log(`ERROR - Connection failed: ${error.message}`) }
