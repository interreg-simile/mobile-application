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

    // ToDo temporary
    switch (token) {

        case "simpleUserToken":
            req.userId  = "simpleUserId";
            req.isAdmin = false;
            next();
            break;

        case "otherUserToken":
            req.userId  = "otherUserId";
            req.isAdmin = false;
            next();
            break;

        case "adminToken":
            req.userId  = "adminId";
            req.isAdmin = true;
            next();
            break;

        default:
            const error      = new Error("Authentication token not recognized.");
            error.statusCode = 401;
            error.type       = "AuthTokenException";
            next(error);

    }

}
