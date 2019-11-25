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

    const status  = err.statusCode || 500,
          message = status === 500 ? "Something went wrong on the server." : err.message,
          type    = err.type || "InternalError";

    res.status(status).json({ meta: { code: status, errorMessage: message, errorType: type } });

}
