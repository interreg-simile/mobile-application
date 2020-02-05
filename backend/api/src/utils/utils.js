/**
 * @fileoverview This file contains utility functions.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import fs from "fs";


/**
 * Removes a file from the filesystem.
 *
 * @param {string} fileUrl - The file url.
 */
export function removeFile(fileUrl) { try { fs.unlinkSync(fileUrl) } catch (e) { } }


/**
 * Converts the value of the query parameter "sort" of a request to a Mongoose object.
 *
 * @param {string} val - The value passed.
 * @returns {Object} The Mongoose object.
 */
export function getQuerySorting(val) {

    // Initialize the object
    const s = {};

    // For each property
    for (const v of val.split(",")) {

        // Create the Mongoose compliant property
        s[v.split(":")[0]] = (!v.split(":")[1] || v.split(":")[1] === "asc") ? 1 : -1;

    }

    // Return the object
    return s;

}


/**
 * Populates all the "description" fields of an object.
 *
 * @param {Object} obj - The object.
 * @param {Function} t - The i18next translation function fixed on the response language.
 * @param {String} ns - The namespace containing the keys for the "description" fields.
 */
export function populateObjDescriptions(obj, t, ns) {

    // For each of the keys of the object
    for (const k in obj) {

        // If the key is a natural property and is not a Mongoose internal object
        if (obj.hasOwnProperty(k) && k !== "_id" && k !== "uid" && k !== "createdAt" && k !== "updatedAt") {

            // If the key is "dCode", populate the "description" field
            if (k === "dCode") obj[k].description = t(`${ns}:${obj[k].path}.${obj[k].code}`);

            // Else if the key corresponds to an object, call the function recursively
             else if (typeof obj[k] === "object") populateObjDescriptions(obj[k], t, ns);

        }

    }

}
