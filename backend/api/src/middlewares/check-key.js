import Key from "../modules/auth/key.model";

/*
 * Check if the request has a valid API key in the headers.
 */
export default function (req, res, next) {

    // Extract the key
    const keyHeader = req.get("X-API-KEY");

    // If no key is found, throw an error
    if (!keyHeader) {
        const error      = new Error("API key missing.");
        error.statusCode = 403;
        next(error);
        return;
    }

    // Search che key in the database
    Key.findOne({ key: keyHeader })
        .then(result => {

            // If no key is found, throw an error
            if (!result) {
                const error      = new Error("API key not recognized.");
                error.statusCode = 403;
                next(error);
            }

            next()

        })
        .catch(err => next(err));

}
