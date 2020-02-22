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
                // noinspection JSUnfilteredForInLoop
                req.body[field] = JSON.parse(req.body[field])
            } catch (e) {
                next(constructError(422));
                return;
            }

    }

    // Call the next middleware
    next();

}


// ToDo remove if not needed
/**
 * Finds any value equals to "undefined" (as string) and substitute them with actual undefined values.
 *
 * @param {Object} obj - The object to modify.
 */
function handleUndefined(obj) {

    // Loop on the keys
    Object.keys(obj).forEach(k => {

        // If the property is an object, call the function recursively
        if (typeof obj[k] === "object") handleUndefined(obj[k]);

        // Else if the value is "undefined" set it to undefined
        else if (obj[k] === "undefined") obj[k] = undefined;

    });

}
