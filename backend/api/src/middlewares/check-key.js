/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import constructError from "../utils/construct-error";
import { getKeyByValue } from "../modules/auth/auth.service";


/**
 * Checks if the request has a valid API key in the X-API-KEY header.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // If the route does not need the key, skip the check
    if (!req.config.key_required) {
        next();
        return;
    }

    // Extract the key
    const keyHeader = req.get("X-API-KEY");

    // If no key is found, throw an error
    if (!keyHeader) {
        next(constructError(403, "messages.apiKeyMissing"));
        return;
    }

    // Search che key in the database
    getKeyByValue(keyHeader)
        .then(() => next())
        .catch(() => next(constructError(403, "messages.apiKeyNotRecognized")));

}
