import mongoose from "mongoose";

import { validationResult } from "express-validator";
import { constructError } from "./construct-error";


/**
 * Checks if the user is authorized to perform the request.
 *
 * @param {Object} req - The Express request object.
 * @param {Function} next - The Express next middleware function.
 * @param {string} [userId] - The id of the user to check.
 * @returns {boolean} The result of the check.
 */
export const checkIfAuthorized = (req, next, userId) => {

    if (!req.isAdmin && (userId && req.userId !== userId)) {
        next(constructError(401));
        return false;
    }

    return true;

};

/**
 * Checks if the validation of the body of a request presents errors.
 *
 * @param {Object} req - The Express request object.
 * @param {Function} next - The Express next middleware function.
 * @returns {boolean} The result of the check.
 */
export const checkValidation = (req, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(constructError(422, errors.errors[0].msg));
        return false;
    }

    return true;

};

/**
 * Checks if a given id is a valid Mongoose id.
 *
 * @param {string} id - The id to check.
 * @param {Function} next - The Express next middleware function.
 * @returns {boolean} The result of the check.
 */
export const checkIdValidity = (id, next) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        next(constructError(400, "Id not valid.", "BadIdException"));
        return false;
    }

    return true;

};
