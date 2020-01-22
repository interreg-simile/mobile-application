import { body, query, oneOf } from "express-validator";
import { vQuery, enums, vBody } from "../../utils/common-validations";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast, ...vQuery.includeDeletedAdmin, ...vQuery.sort, ...vQuery.rois,
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
    body("coordinates")
        .not().isEmpty().withMessage("Missing property 'coordinates'.")
        .isArray({ min: 2, max: 2 }).withMessage("Wrong format of property 'coordinates'.")
        .custom(v => !(v[0] < -180.0 || v[0] > 180.0 || v[1] < -90.0 || v[1] > 90.0))
        .withMessage("Invalid value of property 'coordinates'."),
    body("coordinates.*")
        .not().isEmpty().withMessage("Missing one of the 'coordinates'.")
        .isFloat().withMessage("Wrong format of one of the 'coordinates'."),
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
        .isIn(enums.county).withMessage("Invalid value of property 'country' of 'address'."),
    ...vBody.rois,
    body("date")
        .not().isEmpty().withMessage("Missing property 'date'.")
        .isISO8601().withMessage("Wrong format of property 'date'."),
    body("cover")
        .isEmpty().withMessage("Set forbidden property 'cover'."),
    body("contacts")
        .not().isEmpty().withMessage("Missing property 'contacts'."),
    oneOf([
        body("contacts.mail")
            .not().isEmpty()
            .isEmail().withMessage("Wrong format of property 'mail' of 'contacts'.")
            .normalizeEmail(),
        body("contacts.phone")
            .not().isEmpty()
            .isMobilePhone("any", { strictMode: true })
            .withMessage("Wrong format of property 'phone' of 'contacts'.")
    ], "At least one contact has to be specified."),
    body("participants")
        .optional()
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'."),
    body("markedForDeletion")
        .isEmpty().withMessage("Forbidden value of property 'markedForDeletion'.")
];


// Validation chain for the body of the "patch" requests
export const patch = [];


// Validation chain for the "participants" field
export const participants = [
    body("participants")
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'.")
];
