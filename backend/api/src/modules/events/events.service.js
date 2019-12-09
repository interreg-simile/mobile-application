import Event from "./events.model";
import { constructError } from "../../utils/construct-error";
import { removeFile } from "../../utils/utils";


/**
 * Retrieves all the events in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Object>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    return Event.find(filter, projection, options);

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
    const event = Event.findOne({ _id: id, ...filter }, projection, options);

    // If no data is found, throw an error
    if (!event) throw constructError(404, "Resource not found.");

    // Return the data
    return event;

}


/**
 * Creates a new event and saves it in the database.
 *
 * @param {Object} data - The event data.
 * @returns {Promise<Object>} A promise containing the newly created event.
 */
export async function create(data) {

    // Create the new event
    const event = new Event({
        titleIta      : data.titleIta,
        titleEng      : data.titleEng,
        descriptionIta: data.descriptionIta,
        descriptionEng: data.descriptionEng,
        position      : data.position,
        address       : data.address,
        rois          : data.rois,
        date          : data.date,
        imageUrl      : data.imageUrl,
        participants  : data.participants,
    });

    // Save the event
    return await event.save();

}


/**
 * Update an existing event.
 *
 * @param {string} id - The id of the event.
 * @param {Object} data - The new data.
 * @returns {Promise<Object>} A promise containing the newly created event.
 */
export async function update(id, data) {

    // Find the event
    const event = await Event.findById(id);

    // If no data is found, throw an error
    if (!event) throw constructError(404, "Resource not found.");

    // Update the values
    event.titleIta       = data.titleIta;
    event.titleEng       = data.titleEng || event.titleEng;
    event.descriptionIta = data.descriptionIta;
    event.descriptionEng = data.descriptionEng || event.descriptionEng;
    event.position       = data.position;
    event.address        = data.address;
    event.rois           = data.rois;
    event.date           = data.date;
    event.imageUrl       = data.imageUrl || event.imageUrl;
    event.participants   = data.participants || event.participants;

    // Save the event
    const newEvent = await event.save();

    // If a new image has been provided, delete the old image
    if (data.imageUrl) removeFile(event.imageUrl);

    return newEvent;

}


/**
 * Sets the number of participants of an event.
 *
 * @param {string} id - The id of the event.
 * @param {number} participants - The number of participants.
 * @returns {Promise<Object>} A promise containing the modified event.
 */
export async function setParticipants(id, participants) {

    // Find the event
    const event = await Event.findById(id);

    // If no data is found, throw an error
    if (!event) throw constructError(404, "Event not found.");

    // Save the data
    event.participants = participants;

    // Save the event
    return await event.save();

}


/**
 * Set an event as marked for deletion.
 *
 * @param {String} id - The id of the event.
 * @returns {Promise<void>}
 */
export async function softDelete(id) {

    // Find the event
    const event = await Event.findOne({ _id: id, markedForDeletion: false });

    // If no data is found, throw an error
    if (!event) throw constructError(404, "Resource not found.");

    // Mark the survey for deletion
    event.markedForDeletion = true;

    // Save the change
    await event.save();

}
