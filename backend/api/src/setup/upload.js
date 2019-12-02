import multer from "multer";
import uuid from "uuid/v4"
import { constructError } from "../utils/construct-error";


/** Storage options for multer. */
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename   : (req, file, cb) => cb(null, `${uuid()}.${file.mimetype.split("/")[1]}`)
});

/** File filter for multer. */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg")
        cb(null, true);
    else {
        cb(constructError(422, "Test"));
    }
};

/** Multer middleware. */
export default multer({ storage: storage, fileFilter: fileFilter });
