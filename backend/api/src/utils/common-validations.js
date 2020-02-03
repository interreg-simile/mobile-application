import { body, param, query, ValidationChain } from "express-validator";


// Enum for common values // ToDo transform in numbers
export const enums = {
    roi   : ["lake_como", "lake_maggiore", "lake_lugano"],
    county: ["italy", "switzerland"],
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
    rois   : [
        body("rois")
            .not().isEmpty().withMessage("Missing property 'rois'.")
            .isArray().withMessage("Wrong format of property 'rois'."),
        body("rois.*")
            .isIn(enums.roi).withMessage("Invalid value of one of the properties of 'rois'."),
    ],
    roisOpt: [
        body("rois")
            .optional()
            .not().isEmpty().withMessage("Missing property 'rois'.")
            .isArray().withMessage("Wrong format of property 'rois'."),
        body("rois.*")
            .isIn(enums.roi).withMessage("Invalid value of one of the properties of 'rois'."),
    ]
};


/**
 * Creates a validation chain for a generic coordinates field.
 *
 * @param {String} field - The chain that brings to the field.
 * @param {Boolean} opt - True if the field could be optional.
 * @return {ValidationChain[]} The validation chain.
 */
export function vCoords(field, opt) {

    // Save the validation of the field
    const validation = body(field);

    // If the field is optional, append the optional validation
    if (opt) validation.optional();

    // Return the field validation
    return [

        validation
            .not().isEmpty().withMessage(`validation.missing;{"name": "${field}"}`)
            .isArray({ min: 2, max: 2 }).withMessage(`validation.wrongFormat;{"name": "${field}"}`)
            .custom(v => !(v[0] < -180.0 || v[0] > 180.0 || v[1] < -90.0 || v[1] > 90.0))
            .withMessage(`validation.invalidValue;{"name": "${field}"}`),

        body(`${field}.*`)
            .not().isEmpty().withMessage(`validation.missingOne;{"name": "${field}"}`)
            .isFloat().withMessage(`validation.wrongFormatOne;{"name": "${field}"}`)

    ]

}


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

    // Initialize the object of the already processed values
    const valSoFar = Object.create(null);

    // For each value
    for (const v of val.split(",")) {

        // If the value is not in the form "key:order" or "key", return false
        if (!(allowedFields.includes(v.split(":")[0]) &&
            (!v.split(":")[1] || ["asc", "desc"].includes((v.split(":")[1]))))) return false;

        // If the value is passed more than one, return false
        if (v.split(":")[0] in valSoFar) return false;

        // Save the value as processed
        valSoFar[v.split(":")[0]] = true;

    }

    // Return true
    return true

}
