import Alert from "./alerts.model";
import { constructError } from "../../utils/construct-error";


/**
 * Retrieves all the alerts in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Object>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    return Alert.find(filter, projection, options);

}


/**
 * Retrieves the alert with the given id.
 *
 * @param {string} id - The id of the alert.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Object>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options) {

    // Find the data
    const alert = Alert.findOne({ _id: id, ...filter }, projection, options);

    // If no data is found, throw an error
    if (!alert) throw constructError(404, "Resource not found.");

    // Return the data
    return alert;

}


/**
 * Creates a new alert and saves it in the database.
 *
 * @param {Object} data - The event data.
 * @returns {Promise<Object>} A promise containing the newly created alert.
 */
export async function create(data) {

    // Create the new alert
    const alert = new Alert({
        titleIta  : data.titleIta,
        titleEng  : data.titleEng,
        contentIta: data.contentIta,
        contentEng: data.contentEng,
        dateStart : data.dateStart,
        dateEnd   : data.dateEnd,
        rois      : data.rois,
    });

    // Save the alert
    return await alert.save();

}


/**
 * Update an existing alert.
 *
 * @param {string} id - The id of the alert.
 * @param {Object} data - The new data.
 * @returns {Promise<Object>} A promise containing the newly created alert.
 */
export async function update(id, data) {

    // Find the alert
    const alert = await Alert.findById(id);

    // If no data is found, throw an error
    if (!alert) throw constructError(404, "Resource not found.");

    // Update the values
    alert.titleIta   = data.titleIta;
    alert.titleEng   = data.titleEng;
    alert.contentIta = data.contentIta;
    alert.contentEng = data.contentEng;
    alert.dateStart  = data.dateStart;
    alert.dateEnd    = data.dateEnd;
    alert.rois       = data.rois;

    // Save the event
    return await alert.save();

}


/**
 * Set an alert as marked for deletion.
 *
 * @param {String} id - The id of the alert.
 * @returns {Promise<void>} - An empty promise.
 */
export async function softDelete(id) {

    // Find the event
    const alert = await Alert.findOne({ _id: id, markedForDeletion: false });

    // If no data is found, throw an error
    if (!alert) throw constructError(404, "Resource not found.");

    // Mark the survey for deletion
    alert.markedForDeletion = true;

    // Save the change
    await alert.save();

}
