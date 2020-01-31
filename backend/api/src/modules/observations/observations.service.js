import Observation from "./observations.model";
import { constructError } from "../../utils/construct-error";
import { populateObjDescriptions } from "../../utils/utils";


/**
 * Retrieves all the observations in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Observation[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    return Observation.find(filter, projection, { lean: true, ...options });

}


/**
 * Retrieves the observation with the given id.
 *
 * @param {string} id - The id of the observation.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @param {String} lng - The language requested.
 * @returns {Promise<Observation>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options, lng) {

    // Find the data
    const obs = await Observation.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    // If no data is found, throw an error
    if (!obs) throw constructError(404);

    // Populate the "description" fields of the observation
    populateObjDescriptions(obs, lng, "observations");

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
