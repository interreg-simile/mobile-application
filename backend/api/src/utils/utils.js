import fs from "fs";


/**
 * Removes a file from the filesystem.
 *
 * @param {string} fileUrl - The file url.
 */
export function removeFile(fileUrl) { try { fs.unlinkSync(fileUrl) } catch (e) { console.error(e) } }


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
 * Changes the value associated to a given key in an object considering also any nested object.
 *
 * @param {Object} obj - The object which has the property to change.
 * @param {string} key - The key of the property to change.
 * @param {any} newVal - The new value to assign to the property.
 * @return {boolean} True if the property has been found and the value correctly changed.
 */
export function changeNestedObjProperty(obj, key, newVal) {

    let res;

    for (const prop in obj) {

        if (obj.hasOwnProperty(prop)) {

            if (prop === key) {

                obj[key] = newVal;

                return true;

            }

            if (typeof obj[prop] === "object") {

                res = changeNestedObjProperty(obj[prop], key, newVal);

                if (res) return true;

            }

        }

    }

    return false;

}


// ToDo
export function populateObjDescriptions(obj, lng, ns) {

    let keyChain = [];

    for (const key in obj) {

        if (obj.hasOwnProperty(key) && key !== "_id" && key !== "uid" && key !== "createdAt" && key !== "updatedAt") {

            keyChain.push(key);

            console.log(`${key}: ${obj[key]} - ${typeof obj[key]}`);

            if (typeof obj[key] === "object") {

                console.log("---- Nested object found");

                populateObjDescriptions(obj[key], lng, ns);

            }

            if (key === "dCode") {

                console.log(`=== ${keyChain}`);

            }

            keyChain = [];

        }

    }

}
