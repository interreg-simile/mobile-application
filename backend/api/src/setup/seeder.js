import mongoose from "mongoose";

import { connectDb } from "./database";
import { NODE_ENV } from "../config/env";

import survey from "../modules/survey/survey.seed";
import user from "../modules/user/user.seed";

/**
 * Seeds the database with dummy data.
 *
 * @returns {Promise<void>}
 */
async function seeder() {

    console.info("SEED - Started");

    // Connect to the database
    await connectDb();

    // @temp
    // If the program is running in development mode, clear the database
    if (NODE_ENV === "development") {
        console.info("SEED - Clearing database...");
        await mongoose.connection.dropDatabase();
    }

    // Seed the data
    await user();
    await survey();

    // Close the connection
    await mongoose.connection.close();

    console.info("SEED - Complete");

}

// Run the seeder
seeder().catch(err => console.error(`Error - Seed failed: ${err}`));
