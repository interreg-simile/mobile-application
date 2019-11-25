/**
 * Constructs an error object.
 *
 * @param {number} code - The code of the error.
 * @param {string} [msg] - The message of the error.
 * @param {string} [type] - The type of the error.
 * @returns {Error} The error object.
 */
export const constructError = (code, msg, type) => {

    const error = new Error();

    switch (code) {

        case 400:
            error.message    = msg || "Something is wrong in your request.";
            error.statusCode = code;
            error.type       = type || "BadRequestException";
            break;

        case 401:
            error.message    = msg || "You are not authorized to perform this action.";
            error.statusCode = code;
            error.type       = type || "NotAuthorizedException";
            break;

        case 403:
            error.message    = msg || "You are not allowed to perform this action.";
            error.statusCode = code;
            error.type       = type || "ForbiddenException";
            break;

        case 404:
            error.message    = msg || "Resource not found.";
            error.statusCode = code;
            error.type       = type || "NotAuthorizedException";
            break;

        case 422:
            error.message    = msg || "The body of the request contains some error.";
            error.statusCode = code;
            error.type       = type || "BodyValidationException";
            break;

        case 500:
            error.message    = msg || "Something went wrong on the server.";
            error.statusCode = code;
            error.type       = type || "InternalError";
            break;

        default:
            error.message    = "Bad request.";
            error.statusCode = 400;
            error.type       = "BadRequestException";

    }

    return error;

};
