import { constructError } from "../../utils/construct-error";
import { checkValidation } from "../../utils/common-checks";
import * as eventService from "./events.service";
import { getQuerySorting } from "../../utils/utils";


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
          sort           = req.query.sort,
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

    // Exclude the events marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // Take the events with expireDate greater than or equal to the current date
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

    // If the request does not come from an admin, project out the uid
    if (!req.isAdmin) projection.uid = 0;

    // Sort
    if (sort) options.sort = getQuerySorting(sort);

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
    eventService.create({ uid: req.userId, ...req.body, cover: req.file.path })
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
    const filter = {}, projection = {};

    // If the user is not admin
    if (!req.isAdmin) {

        // Don't return the event if it's marked for deletion
        filter.markedForDeletion = false;

        // Project out the uid
        projection.uid = 0;

    }

    // Find the data
    eventService.getById(req.params.id, filter, projection, {})
        .then(event => res.status(200).json({ meta: { code: 200 }, data: { event } }))
        .catch(err => next(err));

};


/**
 * Updates an event.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const update = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Update the event
    eventService.update(req.params.id, { uid: req.userId, ...req.body, cover: req.file.path })
        .then(result => res.status(200).json(
            { meta: { code: result.created ? 201 : 200 }, data: { event: result.newEvent } }
        ))
        .catch(err => next(err));

};


/**
 * Patch an event.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const patch = (req, res, next) => {

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    // Save the body in the data to patch
    const data = { ...req.body };

    // If an image has been provided, add its path to the data
    if (req.file) data.cover = req.file.path;

    // Patch the event
    eventService.patch(req.params.id, data)
        .then(event => res.status(200).json({ meta: { code: 200 }, data: { event } }))
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
    eventService.softDelete(req.params.id)
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
