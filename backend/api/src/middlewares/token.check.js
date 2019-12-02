import jwt from "jsonwebtoken";

import { JWT_PK } from "../config/env";
import { constructError } from "../utils/construct-error";

/**
 * Extracts and verifies the authorization token attached to any incoming request.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // Extract the authorization header
    const authHeader = req.get("Authorization");

    // If no header is found, proceed (some routes can be accessed without a valid token)
    if (!authHeader) {
        req.isAdmin = false;
        req.userId  = null;
        next();
        return;
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    let decodedToken;

    // Try to decode the token
    try {
        decodedToken = jwt.verify(token, JWT_PK);
    } catch (err) {
        next(constructError(400, err.message, err.name));
        return;
    }

    // Save idValidation and status of the user
    req.userId  = decodedToken.userId;
    req.isAdmin = decodedToken.isAdmin === "true";

    // Call the next middleware
    next();

}
