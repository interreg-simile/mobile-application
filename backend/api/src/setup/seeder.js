import mongoose from "mongoose";

import { NODE_ENV } from "../config/env";
import { connectDb } from "./database";

import survey from "../modules/survey/survey.seed";
import apiKey from "../modules/auth/key.seed";
import user from "../modules/user/user.seed";
import event from "../modules/event/event.seed";


/**
 * Seeds the database with dummy data.
 *
 * @returns {Promise<void>}
 */
async function seeder() {

    console.info("SEED - Started");

    // Connect to the database
    await connectDb();

    // Seed the data
    // await apiKey();
    // await user();
    // await survey();
    await event();

    // Close the connection
    await mongoose.connection.close();

    console.info("SEED - Complete");

}


/**
 * Drops a db collection if it exists.
 *
 * @param {string} collection - The name of the collection to drop.
 * @returns {Promise<void>}
 */
export async function dropCollection(collection) {

    // If the application is not running in development mode, return
    if (NODE_ENV !== "development") return;

    // Fetch the list of the collection in the database
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Drop the collection if it exists
    for (const c of collections) { if (c.name === collection) await mongoose.connection.dropCollection(collection) }

}


// Run the seeder
seeder().catch(err => console.error(`Error - Seed failed: ${err}`));
