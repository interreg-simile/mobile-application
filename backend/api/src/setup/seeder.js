import mongoose from "mongoose";

import { connectDb } from "./database";

import survey from "../modules/survey/survey.seed";
import apiKey from "../modules/auth/key.seed";
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

    // Seed the data
    // await apiKey();
    // await user();
    await survey();

    // Close the connection
    await mongoose.connection.close();

    console.info("SEED - Complete");

}

// Run the seeder
seeder().catch(err => console.error(`Error - Seed failed: ${err}`));
