import { body, query } from "express-validator";
import { countryEnum, roiEnum } from "../../utils/common-validations";


export const getAllQuery = [
    query("includePast")
        .optional()
        .isBoolean().withMessage("Wrong format of query parameter 'includePast'."),
    query("includeDeleted")
        .optional()
        .isBoolean().withMessage("Wrong format of query parameter 'includeDeleted'."),
    query("orderByDate")
        .optional()
        .isBoolean().withMessage("Wrong format of query parameter 'orderByDate'."),
    query("rois")
        .optional()
        .custom(v => {
            return v.split(",").every(e => roiEnum.indexOf(e) >= 0) &&
                new Set(v.split(",")).size === v.split(",").length
        }).withMessage("Wrong format of query parameter 'rois'."),
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


export const event = [
    body("title")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'title'."),
    body("descriptionEng")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'descriptionEng'."),
    body("descriptionIta")
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
        .isIn(countryEnum).withMessage("Invalid value of property 'country' of 'address'."),
    body("rois")
        .not().isEmpty().withMessage("Missing property 'rois'.")
        .isArray().withMessage("Wrong format of property 'rois'."),
    body("rois.*")
        .isIn(roiEnum).withMessage("Invalid value of one of the properties of 'rois'."),
    body("date")
        .not().isEmpty().withMessage("Missing property 'date'.")
        .isISO8601().withMessage("Wrong format of property 'date'."),
    body("imageUrl")
        .isEmpty().withMessage("Set forbidden property 'imageUrl'."),
    body("participants")
        .optional()
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'."),
    body("markedForDeletion")
        .optional()
        .isBoolean().withMessage("Wrong format of property 'markedForDeletion'.")
];


export const participants = [
    body("participants")
        .isInt({ min: 0 }).withMessage("Wrong format of property 'participants'.")
];
