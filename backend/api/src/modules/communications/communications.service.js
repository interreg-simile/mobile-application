import Communication from "./communications.model";
import { constructError } from "../../utils/construct-error";


/**
 * Retrieves all the communications in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Object>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    return Communication.find(filter, projection, options);

}


/**
 * Retrieves the event with the given id.
 *
 * @param {string} id - The id of the event.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Object>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options) {

    // Find the data
    const communication = Communication.findOne({ _id: id, ...filter }, projection, options);

    // If no data is found, throw an error
    if (!communication) throw constructError(404, "Resource not found.");

    // Return the data
    return communication;

}


/**
 * Creates a new event and saves it in the database.
 *
 * @param {Object} data - The event data.
 * @returns {Promise<Object>} A promise containing the newly created event.
 */
export async function create(data) {

    // Create the new event
    const communication = new Communication({
        titleIta  : data.titleIta,
        titleEng  : data.titleEng,
        contentIta: data.contentIta,
        contentEng: data.contentEng,
        dateStart : data.dateStart,
        dateEnd   : data.dateEnd,
        rois      : data.rois,
    });

    // Save the event
    return await communication.save();

}


/**
 * Update an existing event.
 *
 * @param {string} id - The id of the event.
 * @param {Object} data - The new data.
 * @returns {Promise<Object>} A promise containing the newly created event.
 */
export async function update(id, data) {

    // Find the communication
    const communication = await Communication.findById(id);

    // If no data is found, throw an error
    if (!communication) throw constructError(404, "Resource not found.");

    // Update the values
    communication.titleIta   = data.titleIta;
    communication.titleEng   = data.titleEng;
    communication.contentIta = data.contentIta;
    communication.contentEng = data.contentEng;
    communication.dateStart  = data.dateStart;
    communication.dateEnd    = data.dateEnd;
    communication.rois       = data.rois;

    // Save the event
    return await communication.save();

}


/**
 * Set an event as marked for deletion.
 *
 * @param {String} id - The id of the event.
 * @returns {Promise<void>}
 */
export async function softDelete(id) {

    // Find the event
    const communication = await Communication.findOne({ _id: id, markedForDeletion: false });

    // If no data is found, throw an error
    if (!communication) throw constructError(404, "Resource not found.");

    // Mark the survey for deletion
    communication.markedForDeletion = true;

    // Save the change
    await communication.save();

}
