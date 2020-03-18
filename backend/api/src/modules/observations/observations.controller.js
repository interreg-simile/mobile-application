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
import { populateDescriptions } from "./observations.service";
import { projectObservation } from "./observations.service";
import { convertToGeoJsonFeature } from "./observations.service";


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
          excludeOutOfRois = req.query.excludeOutOfRois || "false",
          crs              = req.query.crs,
          mode             = req.query.mode;

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the events marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    if (excludeOutOfRois === "true") filter["position.roi"] = { $exists: true };

    // If the user wants a minimal response, keep only the required fields
    if (minimalRes === "true") {
        projection._id                     = 1;
        projection.uid                     = 1;
        projection["position.coordinates"] = 1;
        projection["position.roi"]         = 1;
    }

    // Find the observations
    observationService.getAll(filter, projection, options)
        .then(observations => {

            // Initialize the GeoJSON object to null
            let geoJson = null;

            // If the user has requested the data in GeoJSON format, properly initialize the object
            if (mode && mode.toLowerCase() === "geojson") geoJson = { type: "FeatureCollection", features: [] };

            // For each of the observations
            for (let i = 0; i < observations.length; i++) {

                // Project the observation coordinates
                if (crs && crs !== "1") projectObservation(observations[i], crs);

                // Populate the "description" fields of the observation
                populateDescriptions(observations[i], req.t);

                // If the user has requested the data in GeoJSON format, push the converted observation in the object
                if (geoJson) geoJson.features.push(convertToGeoJsonFeature(observations[i]));

            }

            // Return the data
            res.status(200).json({ meta: { code: 200 }, data: geoJson ? geoJson : observations });

        })
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

    if (!checkValidation(req, next)) return;

    const minimalRes = req.query.minimalRes || "false";

    const data = {
        // uid   : req.userId,
        ...req.body
    };

    if (_.has(req, ["files", "photos"]))
        data.photos = req.files.photos.map(p => p.path);

    if (_.has(req, ["files", "signage"]))
        _.set(data, ["details", "outlets", "signagePhoto"], req.files.signage[0].path);

    observationService.create(data)
        .then(observation => {

            let resData;

            if (minimalRes === "true") {
                resData = {
                    _id     : observation._id,
                    // uid     : observation.uid,
                    position: {
                        coordinates: observation.position.coordinates,
                        roi        : observation.position.roi
                    }
                };
            } else {
                resData = observation;
            }

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

    // Retrieve the query parameters
    const crs  = req.query.crs,
          mode = req.query.mode;

    // Initialize the filer for the query
    const filter = {}, projection = {};

    // If the user is not admin, filter and project out some fields
    if (!req.isAdmin) {
        filter.markedForDeletion     = false;
        projection._id               = 0;
        projection.markedForDeletion = 0;
    }

    // Project out the version
    projection["__v"] = 0;

    // Find the data
    observationService.getById(req.params.id, filter, projection, {})
        .then(observation => {

            // Project the observation coordinates
            if (crs && crs !== "1") projectObservation(observation, crs);

            // Populate the "description" fields of the observation
            populateDescriptions(observation, req.t);

            // If the user has requested the data in GeoJSON format, convert them
            if (mode && mode.toLowerCase() === "geojson") observation = convertToGeoJsonFeature(observation);

            // Return the data
            return res.status(200).json({ meta: { code: 200 }, data: observation });

        })
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
