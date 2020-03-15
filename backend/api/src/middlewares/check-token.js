/**
 * @fileoverview This file contains the logic needed to check the authorization token of the user performing a request
 * and to assess if she has the right permissions to proceed in the request. The permissions needed for each endpoint
 * are defined in the configuration file `api/scr/config/endpoints.yaml`.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import jwt from "jsonwebtoken";

import { JWT_PK } from "../setup/env";
import constructError from "../utils/construct-error";


/**
 * Extracts and verifies the authorization token attached to an incoming request.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // Extract the authorization header
    const authHeader = req.get("Authorization");

    // If no header is found, check the permissions of the route
    if (!authHeader) {
        req.isAdmin = false;
        req.userId  = null;
        checkPermission(req, next);
        return;
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    let decodedToken;

    // Try to decode the token
    try {
        decodedToken = jwt.verify(token, JWT_PK);
    } catch (err) {
        next(constructError(500, "messages.jwtMalformed"));
        return;
    }

    // Save id and status of the user
    req.userId  = decodedToken.userId;
    req.isAdmin = decodedToken.isAdmin === "true";

    // Check the permissions of the route
    checkPermission(req, next);

}


/**
 * Checks if the user has the right permissions to access the route.
 *
 * @param {Object} req - The Express request object.
 * @param {Function} next - The Express next middleware function.
 */
function checkPermission(req, next) {

    // If the user is an admin, call the next middleware
    if (req.isAdmin) {
        next();
        return;
    }

    // If the route is accessible only by an admin, throw an error
    if (req.config.admin_required) {
        next(constructError(401));
        return;
    }

    // If the route requires an authenticate user and the user id is not provided, throw and error
    if (req.config.token_required && !req.userId) {
        next(constructError(401));
        return;
    }

    // Call the next middleware
    next();

}
