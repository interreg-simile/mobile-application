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
import { project } from "../../utils/spatial";


/**
 * Retrieves all the observations in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Observation[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    // Retrieve the observations
    return Observation.find(filter, projection, { lean: true, ...options });

}


/**
 * Retrieves the observation with the given id.
 *
 * @param {string} id - The id of the observation.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Observation>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options) {

    // Find the data
    const obs = await Observation.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    // If no data is found, throw an error
    if (!obs) throw constructError(404);

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
        // uid     : data.uid,
        position: { type: "Point", crs: { code: 1 }, ...data.position },
        weather : data.weather,
        details : data.details,
        measures: data.measures,
        other   : data.other,
        photos  : data.photos,
    });

    if (data.createdAt) obs.createdAt = data.createdAt;

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

    const originalObj = obs;

    const findAndPopulate = (obj, path) => {

        Object.keys(obj).forEach(k => {

            if (k === "_id" || k === "uid" || k === "createdAt" || k === "updatedAt") return;

            path.push(k);

            if (typeof obj[k] === "object") {
                findAndPopulate(obj[k], path)
            } else if (k === "code") {
                path.pop();

                let keyPath = [...path];

                if (!isNaN(keyPath[keyPath.length - 1])) keyPath.pop();

                const instrumentIdx = keyPath.indexOf("instrument");
                if (instrumentIdx !== -1) keyPath.splice((instrumentIdx - 1), 1);

                _.set(
                    originalObj,
                    [...path, "description"],
                    t(`models:observations.${keyPath.join(".")}.${_.get(originalObj, [...path, "code"])}`)
                );

                path.push(k);
            }

            path.pop();

        });

    };

    findAndPopulate(obs, []);

}


/**
 * Project the coordinates of an observation in a given reference system.
 *
 * @param {Observation} obs - The observation.
 * @param {string} crsCode - The code of the target reference system.
 */
export function projectObservation(obs, crsCode) {

    const pCoords = project(crsCode, obs.position.coordinates[1], obs.position.coordinates[0]);

    obs.position.coordinates = [pCoords.lon, pCoords.lat];

    obs.position.crs.code = parseInt(crsCode);

}


/**
 * Converts an observation into GeoJSON format.
 *
 * @param {Observation} obs - The observation.
 * @return {Object} The observation in GoeJSON format.
 */
export function convertToGeoJsonFeature(obs) {

    // Initialize the GeoJSON object
    const gjObs = {
        type      : "Feature",
        geometry  : {
            type       : "Point",
            coordinates: obs.position.coordinates
        },
        properties: {}
    };

    // Assign all the properties of the observation
    Object.assign(gjObs.properties, obs);

    // Delete the coordinates
    delete gjObs.properties.position.coordinates;

    // Return the GeoJSON object
    return gjObs;

}
