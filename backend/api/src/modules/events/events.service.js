/**
 * @fileoverview This file contains the services for the events endpoints. The services are workers which contain the
 * business logic, directly communicates with the database and return to a controller the results of the operations.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import Event from "./events.model";
import constructError from "../../utils/construct-error";
import { removeFile } from "../../utils/utils";


/**
 * Retrieves all the events in the database.
 *
 * @param {Object} filter - The filter to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Event[]>} A promise containing the result of the query.
 */
export async function getAll(filter, projection, options) {

    // Retrieve the events
    return Event.find(filter, projection, { lean: true, ...options });

}


/**
 * Retrieves the event with the given id.
 *
 * @param {string} id - The id of the event.
 * @param {Object} filter - Any additional filters to apply to the query.
 * @param {Object} projection - The projection to apply to the query.
 * @param {Object} options - The options of the query.
 * @returns {Promise<Event>} A promise containing the result of the query.
 */
export async function getById(id, filter, projection, options) {

    // Find the data
    const event = await Event.findOne({ _id: id, ...filter }, projection, { lean: true, ...options });

    // If no data is found, throw an error
    if (!event) throw constructError(404);

    // Return the data
    return event;

}


/**
 * Creates a new event and saves it in the database.
 *
 * @param {Object} data - The event data.
 * @returns {Promise<Event>} A promise containing the newly created event.
 */
export async function create(data) {

    // Create the new event
    const event = new Event({
        uid         : data.uid,
        title       : data.title,
        description : data.description,
        position    : { type: "Point", ...data.position },
        date        : data.date,
        contacts    : data.contacts,
        participants: data.participants
    });

    // If the event id is provided, set it
    if (data.id) event._id = data.id;

    // Save the event
    return event.save();

}


/**
 * Updates an existing event. If the event do not exist, it creates it.
 *
 * @param {string} id - The id of the event.
 * @param {Object} data - The new data.
 * @returns {Promise<{newEvent: Event, created: boolean}>} A promise containing the created or updated event and a flag
 *          stating if the event has been created.
 */
export async function update(id, data) {

    // Find the event
    const event = await Event.findById(id);

    // If no data is found, create a new event
    if (!event) return { newEvent: await create({ id: id, ...data }), created: true };

    // Save the old image url
    const oldImg = event.cover;

    // Update the values
    event.description  = data.description;
    event.position     = { type: "Point", ...data.position };
    event.date         = data.date;
    event.contacts     = data.contacts;
    event.participants = data.participants;

    // Save the event
    const newEvent = await event.save();

    // Delete the old image
    removeFile(oldImg);

    return { newEvent: newEvent, created: false };

}


/**
 * Patch an existing event.
 *
 * @param {string} id - The id of the event.
 * @param {Object} data - The new data.
 * @returns {Promise<Event>} A promise containing the patched event.
 */
export async function patch(id, data) {

    // Find the event
    const event = await Event.findById(id);

    // If no data is found, throw an error
    if (!event) throw constructError(404);

    // Change the value of the given properties
    for (const k of Object.keys(data)) event[k] = data[k];

    // Save the event
    return event.save();

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
    if (!event) throw constructError(404);

    // Mark the survey for deletion
    event.markedForDeletion = true;

    // Save the change
    await event.save();

}
