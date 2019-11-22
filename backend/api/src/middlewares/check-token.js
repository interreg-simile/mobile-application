import jwt from "jsonwebtoken";

import { JWT_PK } from "../config/env";

/*
 * Extracts and verifies the authorization token attached to any incoming request.
 */
export default function (req, res, next) {

    // Extract the authorization header
    const authHeader = req.get("Authorization");

    // If no header is found, proceed (some routes can be accessed without a valid token)
    if (!authHeader) {
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
        err.statusCode = 400;
        err.type       = err.name;
        next(err);
        return;
    }

    // Save id and status of the user
    req.userId  = decodedToken.userId;
    req.isAdmin = decodedToken.isAdmin === "true";

    // Call the next middleware
    next();

}
