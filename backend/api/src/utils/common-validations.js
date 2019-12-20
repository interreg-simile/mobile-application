import { body, param, query } from "express-validator";


// Enum for common values
export const enums = {
    roi   : ["lake_como", "lake_maggiore", "lake_lugano"],
    county: ["italy", "switzerland"]
};


// Validation chains for common path parameters
export const vPath = {
    id: [param("id").isMongoId().withMessage("Wrong format of path parameter 'id'.")]
};


// Validation chains for common query parameters
export const vQuery = {
    includePast        : [
        query("includePast")
            .optional()
            .isBoolean().withMessage("Wrong format of query parameter 'includePast'.")
    ],
    includeDeleted     : [
        query("includeDeleted")
            .optional()
            .isBoolean().withMessage("Wrong format of query parameter 'includeDeleted'.")
    ],
    includeDeletedAdmin: [
        query("includeDeleted")
            .optional()
            .custom((v, { req }) => !(v !== "false" && !req.isAdmin))
            .withMessage("Forbidden value of query parameter 'includeDeleted'.")
            .isBoolean().withMessage("Wrong format of query parameter 'includeDeleted'.")
    ],
    sort               : [
        query("sort")
            .optional()
            .custom((v, { req }) => vSort(v, req.config.sort))
            .withMessage("Wrong format of query parameter 'sort'.")
    ],
    rois               : [
        query("rois")
            .optional()
            .custom(v => v.split(",").every(i => enums.roi.indexOf(i) >= 0) && new Set(v.split(",")).size === v.split(",").length)
            .withMessage("Wrong format of query parameter 'rois'.")
    ]
};


// Validation chains for common body properties
export const vBody = {
    rois: [
        body("rois")
            .not().isEmpty().withMessage("Missing property 'rois'.")
            .isArray().withMessage("Wrong format of property 'rois'."),
        body("rois.*")
            .isIn(enums.roi).withMessage("Invalid value of one of the properties of 'rois'."),
    ]
};


/**
 * Validates the values passed with the 'sort' query parameter.
 *
 * @param {string} val - The passed value.
 * @param {string[]} allowedFields - The allowed field for sorting.
 * @returns {boolean} True if the validation passes.
 */
export function vSort(val, allowedFields) {

    // If no allowed field are passed, return false
    if (!allowedFields) return false;

    // ToDo check if a properties is passed multiple times 

    // Validates the value
    return val.split(",").every(v => allowedFields.includes(v.split(":")[0]) &&
        (!v.split(":")[1] || ["asc", "desc"].includes((v.split(":")[1]))));

}
