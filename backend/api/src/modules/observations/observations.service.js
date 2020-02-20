/**
 * @fileoverview This file contains the services for the observations endpoints. The services are workers which contain
 * the business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import _ from "lodash";

import Observation from "./observations.model";
import constructError from "../../utils/construct-error";


/**
 * Retrieves all the observations in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @param {Function} t - The i18next translation function fixed on the response language.
 * @returns {Promise<Observation[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options, t) {

    // Retrieve the observations
    const obs = await Observation.find(filter, projection, { lean: true, ...options });

    // Populate the "description" fields of the observations
    for (let i = 0; i < obs.length; i++) populateDescriptions(obs[i], t);

    // Return the observations
    return obs;

}


/**
 * Retrieves the observation with the given id.
 *
 * @param {string} id - The id of the observation.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @param {Function} t - The i18next translation function fixed on the response language.
 * @returns {Promise<Observation>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options, t) {

    // Find the data
    const obs = await Observation.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    // If no data is found, throw an error
    if (!obs) throw constructError(404);

    // Populate the "description" fields of the observation
    populateDescriptions(obs, t);

    // Return the data
    return obs;

}


/**
 * Creates a new observation and saves it in the database.
 *
 * @param {Object} data - The observation data.
 * @returns {Promise<Observation>} A promise containing the newly created observation.
 */
export async function create(data) {

    // Create the new observation
    const obs = new Observation({
        uid     : data.uid,
        position: { type: "Point", ...data.position },
        weather : data.weather,
        details : data.details,
        photos  : data.photos,
        measures: data.measures
    });

    // If the observation id is provided, set it
    if (data.id) obs._id = data.id;

    // Save the observation
    return obs.save();

}


/**
 * Set an event as marked for observation.
 *
 * @param {String} id - The id of the observation.
 * @param {Boolean} isAdmin - True if the user making the request is an admin.
 * @param {String} reqUId - The id of the user making the request.
 * @returns {Promise<void>}
 */
export async function softDelete(id, isAdmin, reqUId) {

    // Find the observation
    const obs = await Observation.findOne({ _id: id, markedForDeletion: false });

    // If no data is found, throw an error
    if (!obs) throw constructError(404);

    // If the user making the request is not an admin and does not have paternity, throw an error
    if (!isAdmin && reqUId !== obs.uid.toString()) throw constructError(401);

    // Mark the survey for deletion
    obs.markedForDeletion = true;

    // Save the change
    await obs.save();

}


/**
 * Populates all the "description" fields of an observation.
 *
 * @param {Observation} obs - The observation.
 * @param {Function} t - The i18next translation function fixed on the response language.
 */
export function populateDescriptions(obs, t) {

    // Save the original object
    const originalObs = obs;

    /**
     * Finds all the "dPath" properties in an object and adds to their same level a property description.
     *
     * @param {Object} o - The object.
     * @param {Number} [i] - The index of the array.
     */
    const findAndSub = (o, i) => {

        // For each of the keys of the object
        for (const k in o) {

            // If the key is a natural property and is not a Mongoose internal object
            if (o.hasOwnProperty(k) && k !== "_id" && k !== "uid" && k !== "createdAt" && k !== "updatedAt") {

                // If the key is "dPath"
                if (k === "dPath") {

                    // Compute the base path
                    const basePath = `${o[k]}${i !== undefined ? `[${i}]` : ""}`;

                    // Populate the description field
                    _.set(
                        originalObs,
                        `${basePath}.description`,
                        t(`models:observations.${o[k]}.${_.get(originalObs, `${basePath}.code`)}`)
                    );

                }

                // Else if the key corresponds to an array, call the function for each of the array elements
                else if (Array.isArray(o[k])) o[k].forEach((e, i) => findAndSub(e, i));

                // Else if the key corresponds to an object, call the function recursively
                else if (typeof o[k] === "object") findAndSub(o[k]);

            }

        }

    };

    // Call the function
    findAndSub(obs);

}


// function findPaths(obj, path) {
//
//     if (!path) path = [];
//
//     Object.keys(obj).forEach(k => {
//
//         console.log(k);
//
//         path.push(k);
//
//         if (typeof obj[k] === "object") {
//
//             findPaths(obj[k], path);
//
//         }
//
//         else if (k === "code") {
//
//             console.log(path);
//
//             console.log(`Code found: ${obj[k]}`)
//
//         }
//
//         path.pop()
//
//     });
//
// }
//
//
// const object = {
//     position: { coordinates: [0.0, 0.0], custom: true, accuracy: 20 },
//     weather: { temperature: 21.0,  sky: { code: 1 }, wind: 23 },
//     details: {
//         algae: { colour: { code: 2 }, look: { code: 1 }, iridescent: false }
//     }
// }
//
// findPaths(object);
//

