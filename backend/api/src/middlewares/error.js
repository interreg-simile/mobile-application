/*
 * Handles any error that may occur in a controller.
 *
 * @param {Error} err - The error object.
 */
export default function (err, req, res, next) {

    console.error(err);

    const status  = err.statusCode || 500,
          message = status === 500 ? "Something went wrong on the server." : err.message;

    res.status(status).json({ meta: { code: status, errorMessage: message } });

}
