/**
 * @fileoverview This file contains functions that perform common checks.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { validationResult } from "express-validator";
import constructError from "./construct-error";


/**
 * Checks if the validation of the body of a request presents errors.
 *
 * @param {Object} req - The Express request object.
 * @param {Function} next - The Express next middleware function.
 * @returns {boolean} The result of the check.
 */
export const checkValidation = (req, next) => {

    // Extract the errors
    const errors = validationResult(req);

    // If there is any error
    if (!errors.isEmpty()) {

        // Save the first error parameter and location
        let param    = errors.errors[0].param,
            location = errors.errors[0].location;

        // If the error is nested, save the parameter and the location of the first nested error
        if (param === "_error" && errors.errors[0].nestedErrors) {
            param    = errors.errors[0].nestedErrors[0].param;
            location = errors.errors[0].nestedErrors[0].location;
        }

        // Throw the error
        next(constructError(422, `messages.validation.${location};{"prop":"${param}"}`));

        // Return false
        return false;

    }

    // Return true
    return true;

};
