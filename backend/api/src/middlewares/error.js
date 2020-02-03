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
          message = status === 500 ? req.t("generic.500") : translateMessage(err.message, req.t),
          type    = err.type || "InternalError";

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

    // Try to translate the message
    try {

        // Extract the key and the options
        const key  = `errors:${msg.split(";")[0]}`,
              opts = JSON.parse(msg.split(";")[1]);

        // Return the translation
        return t(key, opts);

    }

        // Return the original message
    catch (e) { return msg }

}
