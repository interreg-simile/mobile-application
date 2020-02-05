/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import constructError from "../utils/construct-error";


/**
 * Parses the body of a request with type "multipart/form-data".
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // If the content type of the request is not multipart/form-data, call the next middleware
    if (!req.is("multipart/form-data")) {
        next();
        return;
    }

    // Parse each of the JSON fields in the body of the request
    for (const field in req.body) {

        // noinspection JSUnfilteredForInLoop
        if (req.body[field][0] === "{" || req.body[field][0] === "[")

            // Try to parse the json and catch any error
            try {
                req.body[field] = JSON.parse(req.body[field])
            } catch (e) {
                next(constructError(422));
                return;
            }


    }

    // Call the next middleware
    next();

}
