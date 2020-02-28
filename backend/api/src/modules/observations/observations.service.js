/**
 * @fileoverview This file contains the services for the observations endpoints. The services are workers which contain
 * the business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import _ from "lodash";

import Observation from "./observations.model";
import constructError from "../../utils/construct-error";
import { getIdByCoords } from "../rois/rois.service";


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
 * @returns {Promise<Object>} A promise containing the newly created observation.
 */
export async function create(data) {

    // If no region of interest has been passed
    if (!data.position.roi) {

        // Find a roi in which the observation falls
        const roi = await getIdByCoords(data.position.coordinates[0], data.position.coordinates[1])
            .catch(err => console.error(err));

        // If a roi is found, save it
        if (roi) data.position.roi = roi._id;

    }

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
function populateDescriptions(obs, t) {

    // Save the original observation
    const originalObj = obs;


    /**
     * Utility function that finds all the "code" fields and adds a "description" field on their same level.
     *
     * @param {Object} obj - The object to manipulate.
     * @param {Array<string>} path - The current path of the sub-property.
     */
    const findAndPopulate = (obj, path) => {

        // For each of the keys of the object
        Object.keys(obj).forEach(k => {

            // If the key is one of the internal Mongoose properties, return
            if (k === "_id" || k === "uid" || k === "createdAt" || k === "updatedAt") return;

            // Push the key into the path
            path.push(k);

            // If the property is an object, call the function recursively
            if (typeof obj[k] === "object") findAndPopulate(obj[k], path);

            // Else if the key is "code"
            else if (k === "code") {

                // Pop the last segment of the path
                path.pop();

                // Clone the path
                let keyPath = [...path];

                // If the object is in an array, remove the index from the key path
                if (!isNaN(keyPath[keyPath.length - 1])) keyPath.pop();

                const instrumentIdx = keyPath.indexOf("instrument");

                if (instrumentIdx !== -1) keyPath.splice((instrumentIdx - 1), 1);

                // Set the description field
                _.set(
                    originalObj,
                    [...path, "description"],
                    t(`models:observations.${keyPath.join(".")}.${_.get(originalObj, [...path, "code"])}`)
                );

                // Re-put the lat segment of the path
                path.push(k);

            }

            // Pop the last segment of the path
            path.pop();

        });

    };

    // Call the function
    findAndPopulate(obs, []);

}
