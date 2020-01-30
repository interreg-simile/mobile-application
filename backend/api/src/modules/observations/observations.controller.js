import { checkValidation } from "../../utils/common-checks";
import * as observationService from "./observations.service";


/**
 * Returns all the observations saved in the database.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getAll = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Retrieve the query parameters
    const includeDeleted = req.query.includeDeleted || "false";

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the events marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // Find the observations
    observationService.getAll(filter, projection, options)
        .then(observations => res.status(200).json({ meta: { code: 200 }, data: { observations } }))
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

    res.status(201).json({});

};


/**
 * Returns the observation with a given id.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const getById = (req, res, next) => {

    // console.log(i18next.getResource("it", "observations", "lakes.1"));

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Initialize the filer for the query
    const filter = {}, projection = {};

    // If the user is not admin, don't return the observation if it's marked for deletion
    if (!req.isAdmin) filter.markedForDeletion = false;

    // Find the data
    observationService.getById(req.params.id, filter, projection, {})
        .then(observation => res.status(200).json({ meta: { code: 200 }, data: { observation } }))
        .catch(err => next(err));

};


/**
 * Marks an observation for deletion.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export const markForDeletion = (req, res, next) => {

    // Validate the request
    if (!checkValidation(req, next)) return;

    // Mark the observation for deletion
    observationService.softDelete(req.params.id, req.isAdmin, req.userId)
        .then(() => res.status(204).json({ meta: { code: 204 } }))
        .catch(err => next(err));

};
