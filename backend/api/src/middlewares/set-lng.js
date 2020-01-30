import { appConf } from "./load-config";
import { constructError } from "../utils/construct-error";


/**
 * Sets the language of the response.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // Retrieve the query parameter
    let lng = req.query.lng || appConf.defaultLng;

    // If the language is not supported throw an error
    if (!appConf.lngs.includes(lng)) {
        next(constructError(422, "Language not supported."));
        return;
    }

    // Save the language in the request object
    req.lng = lng;

    // Call the next middleware
    next()

}
