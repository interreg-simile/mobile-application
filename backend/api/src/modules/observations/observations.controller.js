/**
 * @fileoverview This file contains the controller for the observations endpoints. The controllers are manages which
 * interact with the requests, take what it needs from Express, does some validation, passes the data to the right
 * service(s) and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import _ from "lodash";

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
    const includeDeleted   = req.query.includeDeleted || "false",
          minimalRes       = req.query.minimalRes || "false",
          excludeOutOfRois = req.query.excludeOutOfRois || "false";

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the events marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    if (excludeOutOfRois === "true") filter["position.roi"] = { $exists: true };

    if (minimalRes === "true") {
        projection._id                     = 1;
        projection.uid                     = 1;
        projection["position.coordinates"] = 1;
        projection["position.roi"]         = 1;
    }

    // Find the observations
    observationService.getAll(filter, projection, options, req.t)
        .then(observations => res.status(200).json({ meta: { code: 200 }, data: observations }))
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

    // Retrieve the query parameters
    const minimalRes = req.query.minimalRes || "false";

    // Create the data
    const data = {
        uid   : req.userId,
        ...req.body,
        photos: req.files.photos.map(p => p.path.substring(p.path.indexOf("\\") + 1))
    };

    // If the signage photo has been provided, add it to the data
    if (req.files.signage) _.set(
        data,
        ["details", "outlets", "signagePhoto"],
        req.files.signage[0].path.substring(req.files.signage[0].path.indexOf("\\") + 1)
    );

    // Create the new observation
    observationService.create(data)
        .then(observation => {

            // Initialize the response object
            let resData;

            // If the response has to be minimal, return only the id, uid and coordinates of the observation
            if (minimalRes === "true")
                resData = {
                    _id     : observation._id,
                    uid     : observation.uid,
                    position: {
                        coordinates: observation.position.coordinates,
                        roi        : observation.position.roi
                    }
                };

            // Else, return the whole observation
            else
                resData = observation;

            // Send the response
            res.status(201).json({ meta: { code: 201 }, data: resData });

        })
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
    const filter = {}, projection = {};

    // If the user is not admin, filter and project out some fields
    if (!req.isAdmin) {
        filter.markedForDeletion = false;
        projection._id = 0;
        projection.markedForDeletion = 0;
        projection["__v"] = 0;
    }

    // Find the data
    observationService.getById(req.params.id, filter, projection, {}, req.t)
        .then(observation => res.status(200).json({ meta: { code: 200 }, data: observation }))
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
