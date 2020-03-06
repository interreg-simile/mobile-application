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

    if (!req.is("multipart/form-data")) {
        next();
        return;
    }

    for (const field in req.body) {
            try {
                req.body[field] = JSON.parse(req.body[field])
            } catch (e) {
                next(constructError(422));
                return;
            }

    }

    next();

}
