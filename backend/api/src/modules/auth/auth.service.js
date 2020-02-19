/**
 * @fileoverview This file contains the services for the auth endpoints. The services are workers which contain the
 * business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import crypto from "crypto";

import Key from "./keys.model";
import constructError from "../../utils/construct-error";
import { sendEmail } from "../emails/email.service";


/**
 * Retrieves the API key with the given value.
 *
 * @param {String} val - The value of the API key.
 * @returns {Promise<Key>} A promise containing the key.
 */
export async function getKeyByValue(val) {

    const key = await Key.findOne({ key: val });

    // If no data is found, throw an error
    if (!key) throw constructError(404);

    // Return the data
    return key;

}


/**
 * Creates a new API key and saves it in the database.
 *
 * @param {Object} data - The API key data.
 * @returns {Promise<Key>} A promise containing the newly created API key.
 */
export async function createKey(data) {

    // Create the new key
    const key = new Key({
        key        : crypto.randomBytes(32).toString("hex"),
        description: data.description
    });

    return key.save();

}


export async function register() {

    await sendEmail();

}
