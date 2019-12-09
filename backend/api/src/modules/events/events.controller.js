import { constructError } from "../../utils/construct-error";
import { checkValidation } from "../../utils/common-checks";
import * as eventService from "./events.service";


/**
 * Returns all the events saved in the database.
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
          rois           = req.query.rois,
          city           = req.query.city,
          postalCode     = req.query.postalCode,
          coords         = req.query.coords,
          buffer         = req.query.buffer || 1;

    // Check that the use has passed no more than one geographical filter
    if ([rois, city, postalCode, coords].filter(e => e !== undefined).length > 1) {
        next(constructError(422,
            "You can pass only one query parameter among 'rois', 'city', 'postalCode' and 'coords'."));
        return;
    }

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the survey marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // If the request does not come from an admin, throw an error
    else if (includeDeleted === "true" && !req.isAdmin) {
        next(constructError(401, "You are not authorized to set query parameter includeDeleted to true."));
        return;
    }

    // Take the surveys with expireDate greater or equal to the current date
    if (includePast === "false") filter.date = { $gte: new Date() };

    // Filter by regions of interest
    if (rois) filter.rois = { $in: rois.split(",") };

    // Filter by city
    if (city) filter["address.city"] = { $eq: city.toLocaleLowerCase() };

    // Filter by postal code
    if (postalCode) filter["address.postalCode"] = { $eq: postalCode };

    // Filter by coordinates buffer
    if (coords) {

        const lat = parseFloat(coords.split(",")[0].trim()),
              lon = parseFloat(coords.split(",")[1].trim());

        filter["position.coordinates"] = { $geoWithin: { $centerSphere: [[lon, lat], buffer / 6378.1] } };

    }

    // Sort by date ascending
    if (orderByDate === "true") options.sort = "-date";

    // Find the events
    eventService.getAll(filter, projection, options)
        .then(events => res.status(200).json({ meta: { code: 200 }, data: { events } }))
        .catch(err => next(err));

};


/**
 * Inserts a new event in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const create = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Create the event
    eventService.create({ ...req.body, imageUrl: req.file.path })
        .then(event => res.status(201).json({ meta: { code: 201 }, data: { event } }))
        .catch(err => next(err));

};


/**
 * Returns the event with a given id.
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

    eventService.getById(req.params.id, filter, {}, {})
        .then(event => {

            // If no data is found, throw an error
            if (!event) throw constructError(404, "Event not found.");

            res.status(200).json({ meta: { code: 200 }, data: { event } });

        })
        .catch(err => next(err));

};


/**
 * Update an event.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const update = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // If a new image is provided, append the path to the body
    if (req.file) req.body.imageUrl = req.file.path;

    // Update the event
    eventService.update(req.params.id, req.body)
        .then(event => res.status(200).json({ meta: { code: 200 }, data: { event } }))
        .catch(err => next(err));

};


/**
 * Adds the participants number to a given event.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const addParticipants = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Mark the event for deletion
    eventService.setParticipants(req.params.id, req.body.participants)
        .then(event => res.status(200).json({ meta: { code: 200 }, data: { event } }))
        .catch(err => next(err));

};


/**
 * Mark an event for deletion.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const markForDeletion = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Mark the event for deletion
    eventService.softDelete(req.params.id)
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
