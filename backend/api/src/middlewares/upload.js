import multer from "multer";
import uuid from "uuid/v4"

import constructError from "../utils/construct-error";


// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") cb(null, true);
    else cb(constructError(415));
};


/**
 * If the request yields a file, it stores it on the server.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // If the route does not expect an upload, call the next middleware
    if (!req.config.upload) {
        next();
        return;
    }

    // Set storage options
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, req.config.upload.dest),
        filename   : (req, file, cb) => cb(null, `${uuid()}.${file.mimetype.split("/")[1]}`)
    });

    // Initialize the fields
    const fields = [];

    // Populate the fields
    req.config.upload.fields.forEach(f => fields.push({ name: f.name, maxCount: f.max }));

    // Create the upload function
    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields(fields);

    // Upload the files
    upload(req, res, function (err) {

        // Throw any possible error
        if (err) {

            if (err.code && err.code === "LIMIT_UNEXPECTED_FILE")
                next(constructError(422,
                    `messages.tooManyFiles;{"max": "${req.config.upload.max}", "field": "${err.field}" }`,
                    "types.fileUploadException"));
            else
                next(constructError(500, "", "types.fileUploadException"));

            return;

        }



            // Initialize a variable for saving any field with a number of files uploaded lower than the minimum allowed
            let e = null;

            // For each of the fields
            req.config.upload.fields.some(f => {

                // If the minimum allowed id 0, return false
                if (f.min === 0) return false;

                // If the field has a number of files uploaded lower than the minimum allowed, return true
                if ((!req.files || !Object.keys(req.files).includes(f.name)) || req.files[f.name].length < f.min) {
                    e = f;
                    return true;
                }

                // Return false
                return false;

            });

            /// If there was an error, throw it
            if (e) {

                next(constructError(
                    422,
                    `messages.tooFewFiles;{ "min": "${e.min}", "field": "${e.name}" }`,
                    "types.fileUploadException"
                ));

                return;

            }

            // Call the next middleware
            next();

        });

    }

