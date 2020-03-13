/** @author Edoardo Pessina <edoardo.pessina@polimi.it> */

import multer from "multer";
import uuid from "uuid/v4"

import constructError from "../utils/construct-error";


/**
 * If the request yields a file, it stores it on the server.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    if (!req.config.upload) {
        next();
        return;
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, req.config.upload.dest),
        filename   : (req, file, cb) => cb(null, `${uuid()}.${file.mimetype.split("/")[1]}`)
    });

    const fields = [];

    req.config.upload.fields.forEach(f => fields.push({ name: f.name, maxCount: f.max }));

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") cb(null, true);
        else cb(constructError(415));
    };

    const upload = multer({ storage: storage, fileFilter: fileFilter }).fields(fields);

    upload(req, res, function (err) {

        if (err) {

            if (err.code && err.code === "LIMIT_UNEXPECTED_FILE")
                next(constructError(422,
                    `messages.tooManyFiles;{"max": "${req.config.upload.max}", "field": "${err.field}" }`,
                    "types.fileUploadException"));
            else
                next(constructError(500, "", "types.fileUploadException"));

            return;

        }

        let error = null;

        req.config.upload.fields.some(f => {

            if (f.min === 0) return false;

            if ((!req.files || !Object.keys(req.files).includes(f.name)) || req.files[f.name].length < f.min) {
                error = f;
                return true;
            }

            return false;

        });

        if (error) {

            next(constructError(
                422,
                `messages.tooFewFiles;{ "min": "${error.min}", "field": "${error.name}" }`,
                "types.fileUploadException"
            ));

            return;

        }

        next();

    });

}

