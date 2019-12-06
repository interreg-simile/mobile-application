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

    // Delete an file uploaded before the error
    if (req.file) removeFile(req.file.path);

    // Set the properties of the error
    const status  = err.statusCode || 500,
          message = status === 500 ? "Something went wrong on the server." : err.message,
          type    = err.type || "InternalError";

    // Send the response
    res.status(status).json({ meta: { code: status, errorMessage: message, errorType: type } });

}
