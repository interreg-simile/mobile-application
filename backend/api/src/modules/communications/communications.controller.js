import { constructError } from "../../utils/construct-error";
import { checkValidation } from "../../utils/common-checks";
import * as communicationService from "./communications.service";


/**
 * Returns all the communications saved in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getAll = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Retrieve the query parameters
    const includePast    = req.query.includePast || "false",
          includeDeleted = req.query.includeDeleted || "false",
          orderByDate    = req.query.orderByDate || "false",
          rois           = req.query.rois;

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the survey marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // If the request does not come from an admin, throw an error
    else if (includeDeleted === "true" && !req.isAdmin) {
        next(constructError(401, "You are not authorized to set query parameter 'includeDeleted' to true."));
        return;
    }

    // Take the surveys with expireDate greater or equal to the current date
    if (includePast === "false") filter.dateEnd = { $gte: new Date() };

    // Filter by regions of interest
    if (rois) filter.rois = { $in: rois.split(",") };

    // Sort by date descending
    if (orderByDate === "true") options.sort = "+dateStart";

    // Find the events
    communicationService.getAll(filter, projection, options)
        .then(communications => res.status(200).json({ meta: { code: 200 }, data: { communications } }))
        .catch(err => next(err));

};


/**
 * Inserts a new communication in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const create = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Create the event
    communicationService.create(req.body)
        .then(communication => res.status(201).json({ meta: { code: 201 }, data: { communication } }))
        .catch(err => next(err));

};


/**
 * Returns the communication with a given id.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getById = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Initialize the filer for the query
    const filter = {};

    // If the user is not admin, don't return the event if it's marked for deletion
    if (!req.isAdmin) filter.markedForDeletion = false;

    // Get the communication
    communicationService.getById(req.params.id, filter, {}, {})
        .then(communication => res.status(200).json({ meta: { code: 200 }, data: { communication } }))
        .catch(err => next(err));

};


/**
 * Updates a communication.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const update = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Update the event
    communicationService.update(req.params.id, req.body)
        .then(communication => res.status(200).json({ meta: { code: 200 }, data: { communication } }))
        .catch(err => next(err));

};


/**
 * Marks an event for deletion.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const markForDeletion = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Mark the event for deletion
    communicationService.softDelete(req.params.id)
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
