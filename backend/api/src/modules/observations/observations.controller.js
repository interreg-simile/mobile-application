/**
 * @fileoverview This file contains the controller for the observations endpoints. The controllers are manages which
 * interact with the requests, take what it needs from Express, does some validation, passes the data to the right
 * service(s) and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

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
    observationService.getAll(filter, projection, options, req.t)
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

    // Validate the body of the request
    if (!checkValidation(req, next)) return;

    console.log(req.body.details.foams);

    // Create the data
    const data = {
        uid   : req.userId,
        ...req.body,
        // photos: req.files.photos.map(p => p.path)
    };

    // If the signage photo has been provided, set signage to true
    // if (req.files.signage[0]) {
    //
    //     if (data.details && data.details.outlets) {
    //         data.details.outlets.signage      = true;
    //         data.details.outlets.signagePhoto = req.files.signage[0].path;
    //     } else if (data.details) {
    //         data.details.outlets = { signage: true, signagePhoto: req.files.signage[0].path }
    //     } else {
    //         data.details = { outlets: { signage: true, signagePhoto: req.files.signage[0].path } }
    //     }
    //
    // }

    // Create the new observation
    observationService.create(data)
        .then(observation => res.status(201).json({ meta: { code: 201 }, data: { observation } }))
        .catch(err => next(err));

};


/**
 * Returns the observation with a given id.
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

    // If the user is not admin, don't return the observation if it's marked for deletion
    if (!req.isAdmin) filter.markedForDeletion = false;

    // Find the data
    observationService.getById(req.params.id, filter, {}, {}, req.t)
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
