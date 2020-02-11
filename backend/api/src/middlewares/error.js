/**
 * @fileoverview This file contains the logic needed to handle the errors occurred during the resolution of a request.
 * It translates the error and sends back to the client the right status code, message and error type.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { removeFile } from "../utils/utils";


/**
 * Handles any error that may occur during a response.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (err, req, res, next) {

    // Log the error
    console.error(err);

    // Delete any file uploaded before the error
    for (const k in req.files) req.files[k].forEach(f => removeFile(f.path));

    // Set the properties of the error
    const status  = err.statusCode || 500,
          message = status === 500 ? req.t("errors:messages.500") : translateMessage(err.message, req.t),
          type    = status === 500 ? req.t("errors:types.500") : req.t(`errors:${err.type}`);

    // Send the response
    res.status(status).json({ meta: { code: status, errorMessage: message, errorType: type } });

}


/**
 * Translates an error message.
 *
 * @param {String} msg - The message to translate in the form "key;{options}"
 * @param {Function} t - The i18next translation function fixed on the response language.
 * @return {String} The translated message.
 */
function translateMessage(msg, t) {

    // Extract the key
    const key = `errors:${msg.split(";")[0]}`;

    // Initialize the options
    let opts = {};

    // If any option is provided, parse them
    if (msg.split(";")[1]) opts = JSON.parse(msg.split(";")[1]);

    // Return the translation
    return t(key, opts);

}
