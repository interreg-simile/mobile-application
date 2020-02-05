/**
 * Constructs an error object.
 *
 * @param {number} code - The code of the error.
 * @param {string} [msg] - The message of the error.
 * @param {string} [type] - The type of the error.
 * @returns {Error} The error object.
 */
export default function (code, msg, type) {

    // Initialize the error object
    const error = new Error();

    // Set the status code, message and type of the error
    error.statusCode = code || 500;
    error.message    = msg || `messages.${error.statusCode}`;
    error.type       = type || `types.${error.statusCode}`;

    // Return the error
    return error;

};
