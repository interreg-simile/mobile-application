import Key from "../modules/auth/key.model";
import { constructError } from "../utils/construct-error";

/**
 * Checks if the request has a valid API key in the headers.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // If the route does not need the key, skip the check
    if (req.config && !req.config.key_required) {
        next();
        return;
    }

    // Extract the key
    const keyHeader = req.get("X-API-KEY");

    // If no key is found, throw an error
    if (!keyHeader) {
        next(constructError(403, "API key missing.", "APIKeyException"));
        return;
    }

    // Search che key in the database
    Key.findOne({ key: keyHeader })
        .then(result => {

            // If no key is found, throw an error
            if (!result) {
                next(constructError(403, "API key not recognized.", "APIKeyException"));
                next(error);
            }

            // Call the next middleware
            next()

        })
        .catch(err => next(err));

}
