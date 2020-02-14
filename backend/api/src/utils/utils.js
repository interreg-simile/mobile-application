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
