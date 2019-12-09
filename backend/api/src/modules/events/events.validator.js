import { body, query } from "express-validator";
import { q, e, b } from "../../utils/common-validations";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...q.includePast, ...q.includeDeleted, ...q.orderByDate, ...q.rois,
    query("city")
        .optional()
        .trim().escape(),
    query("postalCode")
        .optional()
        .isPostalCode("any").withMessage("Wrong format of query parameter 'postalCode'."),
    query("coords")
        .optional()
        .isLatLong().withMessage("Wrong format of query parameter 'coords'."),
    query("buffer")
        .optional()
        .isFloat({ min: 0.00 }).withMessage("Wrong format of query parameter 'buffer'."),
];


// Validation chain for the body of the "post" and "put" requests
export const event = [
    body("titleIta")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'titleIta'."),
    body("titleEng")
        .optional()
        .trim().escape(),
    body("descriptionIta")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'descriptionIta'."),
    body("descriptionEng")
        .optional()
        .trim().escape(),
    body("position")
        .not().isEmpty().withMessage("Missing property 'position'."),
    body("position.type")
        .optional()
        .isIn(["Point"]).withMessage("Invalid value of property 'type' of 'position'."),
    body("position.coordinates")
        .not().isEmpty().withMessage("Missing property 'coordinates' of 'position'.")
        .isArray({ min: 2, max: 2 }).withMessage("Wrong format of property 'coordinates' of 'position'.")
        .custom(v => !(v[0] < -180.0 || v[0] > 180.0 || v[1] < -90.0 || v[1] > 90.0))
        .withMessage("Invalid value of property 'coordinates' of 'position'."),
    body("position.coordinates.*")
        .not().isEmpty().withMessage("Missing one of the 'coordinates' of 'position'.")
        .isFloat().withMessage("Wrong format of one of the 'coordinates' of 'position'."),
    body("address")
        .not().isEmpty().withMessage("Missing property 'address'."),
    body("address.main")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'main' of 'address'."),
    body("address.civic")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'civic' of 'address'."),
    body("address.city")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'city' of 'address'."),
    body("address.postalCode")
        .not().isEmpty().withMessage("Missing property 'postalCode' of 'address'.")
        .isPostalCode("any").withMessage("Wrong format of property 'postalCode' of 'address'."),
    body("address.province")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'province' of 'address'.")
        .isLength({ min: 2, max: 2 }).withMessage("Wrong format of property 'province' of 'address'."),
    body("address.country")
        .not().isEmpty().withMessage("Missing property 'country' of 'address'.")
        .isIn(e.county).withMessage("Invalid value of property 'country' of 'address'."),
    ...b.rois,
    body("date")
        .not().isEmpty().withMessage("Missing property 'date'.")
        .isISO8601().withMessage("Wrong format of property 'date'."),
    body("imageUrl")
        .isEmpty().withMessage("Set forbidden property 'imageUrl'."),
    body("participants")
        .optional()
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'."),
    body("markedForDeletion")
        .isEmpty().withMessage("Forbidden value of property 'markedForDeletion'.")
];


// Validation chain for the "participants" field
export const participants = [
    body("participants")
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'.")
];
