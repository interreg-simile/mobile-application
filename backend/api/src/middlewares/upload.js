import multer from "multer";
import uuid from "uuid/v4"

import { constructError } from "../utils/construct-error";


// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") cb(null, true);
    else cb(constructError(415, "File type not supported."));
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

    // Create the upload function
    const upload = multer({ storage: storage, fileFilter: fileFilter }).single(req.config.upload.name);

    // Upload the file
    upload(req, res, function (err) {

        // Throw any error
        if (err) {
            err.statusCode ? next(err) : next(constructError(500, "", "FileUploadException"));
            return;
        }

        // If not file is found and the route requires one, throw an error
        if (!req.file && req.config.upload.required) {
            next(constructError(422, "You need to provide a file.", "FileUploadException"));
            return;
        }

        // Call the next middleware
        next();

    });

}

