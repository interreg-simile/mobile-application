import Event from "./event.model";
import { constructError } from "../utils/construct-error";
import { checkIdValidity, checkIfAuthorized } from "../utils/common-checks";
import Survey from "../survey/survey.model";

/**
 * Returns all the events saved in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getAll = (req, res, next) => {

    // Retrieve the query parameters
    const includePast    = req.query.includePast || "false",
          includeDeleted = req.query.includeDeleted || "false",
          orderByDate    = req.query.orderByDate || "false";

    // Set the parameters for the mongo query
    let filter     = {};
    let projection = {};
    let options    = {};

    // Exclude the survey marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // If the request does not come from an admin, throw an error
    else if (includeDeleted === "true" && !req.isAdmin) {
        next(constructError(401, "You are not authorized to set query parameter includeDeleted to true."));
        return;
    }

    // Take the surveys with expireDate greater or equal to the current date
    if (includePast === "false") filter.date = { $gte: new Date() };

    // Sort by date ascending
    if (orderByDate === "true") options.sort = "-date";

    // Find the data
    Event.find(filter, projection, options)
        .then(events => res.status(200).json({ meta: { code: 200 }, data: { events } }))
        .catch(err => next(err));

};

export const create = (req, res, next) => {

};

export const getById = (req, res, next) => {

};

export const update = (req, res, next) => {

};

export const addParticipants = (req, res, next) => {

};

/**
 * Mark an event for deletion.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const markForDeletion = (req, res, next) => {

    // Extract the event id from the request path
    const eventId = req.params.surveyId;

    // Check the validity of the id
    if (!checkIdValidity(eventId, next)) return;

    // If the request does not come from an admin, throw an error
    if (!checkIfAuthorized(req, next)) return;

    // Find the event
    Event.findById(eventId)
        .then(event => {

            // If no data is found, throw an error
            if (!event) throw constructError(404, "Event not found.");

            // Mark the survey for deletion
            event.markedForDeletion = true;

            // Save the change
            return event.save();

        })
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
