/**
 * @fileoverview This file contains the controller for the events endpoints. The controllers are manages which interact
 * with the requests, take what it needs from Express, does some validation, passes the data to the right service(s)
 * and send back to the user the results.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import mongoose from "mongoose";

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
    const includePast    = req.query.includePast || "true",
          includeDeleted = req.query.includeDeleted || "false",
          sort           = req.query.sort;

    // Set the parameters for the mongo query
    const filter = {}, projection = {}, options = {};

    // Exclude the events marked for deletion
    if (includeDeleted === "false") filter.markedForDeletion = false;

    // Take the events with expireDate greater than or equal to the current date
    if (includePast === "false") filter.date = { $gte: new Date() };

    // If the request does not come from an admin, project out the uid
    if (!req.isAdmin) projection.uid = 0;

    // Sort
    if (sort) options.sort = getQuerySorting(sort);

    // Find the events
    eventService.getAll(filter, projection, options)
        .then(events => res.status(200).json({ meta: { code: 200 }, data: events }))
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
    eventService.create({ uid: req.userId, ...req.body })
        .then(event => res.status(201).json({ meta: { code: 201 }, data: event }))
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
        .then(event => res.status(200).json({ meta: { code: 200 }, data: event }))
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
    eventService.update(req.params.id, { uid: req.userId, ...req.body })
        .then(result => res.status(200).json(
            { meta: { code: result.created ? 201 : 200 }, data: result.newEvent }
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

    // Patch the event
    eventService.patch(req.params.id, ...req.body)
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
