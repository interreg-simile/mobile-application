import i18next from "i18next";

import Observation from "./observations.model";
import { constructError } from "../../utils/construct-error";


/**
 * Retrieves all the observations in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Observation[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    return Observation.find(filter, projection, options);

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

    console.log(id);

    // Find the data
    const obs = Observation.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    // console.log(obs);

    // If no data is found, throw an error
    if (!obs) throw constructError(404, "Resource not found.");

    // populateObservation(obs);

    // Return the data
    return obs;

}


function populateObservation(obs) {

    obs.position.lake.description = i18next.getResource(
        "it",
        "observations",
        `lakes.${obs.position.lake.code}`
    )

}
