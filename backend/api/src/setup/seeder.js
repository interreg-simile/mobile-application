/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import mongoose from "mongoose";

import { appConf } from "../middlewares/load-config";
import connectDb from "./database";

import apiKeys from "../modules/auth/keys.seed";
import users from "../modules/users/user.seed";
import rois from "../modules/rois/rois.seed";
import events from "../modules/events/events.seed";
import alerts from "../modules/alerts/alerts.seed";
import observations from "../modules/observations/observations.seed";


/**
 * Seeds the database with dummy data.
 *
 * @returns {Promise<void>} An empty promise.
 */
async function seeder() {

    console.info("SEED - Started");

    await connectDb();

    try {

        // await users();
        // await rois();
        // await events();
        // await alerts();
        await observations();

        await mongoose.connection.close();

        console.info("SEED - Complete");

    } catch (e) {
        await mongoose.connection.close();
        console.error(`SEED - Error: ${e}`);
    }

}


/**
 * Drops a db collection if it exists.
 *
 * @param {string} collection - The name of the collection to drop.
 * @returns {Promise<void>} An empty promise.
 */
export async function dropCollection(collection) {

    if (appConf.env !== "development") return;

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const c of collections) {
        if (c.name === collection)
            await mongoose.connection.dropCollection(collection)
    }

}


seeder().catch(err => console.error(`Error - Seed failed: ${err}`));
