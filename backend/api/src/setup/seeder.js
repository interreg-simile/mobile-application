import mongoose from "mongoose";

import { NODE_ENV } from "../config/env";
import connectDb from "./database";

import surveys from "../modules/surveys/surveys.seed";
import apiKeys from "../modules/auth/keys.seed";
import users from "../modules/users/user.seed";
import events from "../modules/events/events.seed";


/**
 * Seeds the database with dummy data.
 *
 * @returns {Promise<void>}
 */
async function seeder() {

    console.info("SEED - Started");

    // Connect to the database
    await connectDb();

    try {

        // Seed the data
        await apiKeys();
        await users();
        await surveys();
        await events();

        // Close the connection
        await mongoose.connection.close();

        console.info("SEED - Complete");

    } catch (e) {

        // Close the connection
        await mongoose.connection.close();

        console.error(`SEED - Error: ${e}`);

    }

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
