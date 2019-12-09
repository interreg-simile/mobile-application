import { body, param, query } from "express-validator";


// Enum for common values
export const e = {
    roi: ["lake_como", "lake_maggiore", "lake_lugano"],
    county: ["italy", "switzerland"]
};


// Validation chains for common path parameters
export const p = {
    id: [param("id").isMongoId().withMessage("Wrong format of path parameter 'id'.")]
};


// Validation chains for common query parameters
export const q = {
    includePast   : [
        query("includePast")
            .optional()
            .isBoolean().withMessage("Wrong format of query parameter 'includePast'.")
    ],
    includeDeleted: [
        query("includeDeleted")
            .optional()
            .isBoolean().withMessage("Wrong format of query parameter 'includeDeleted'.")
    ],
    orderByDate   : [
        query("orderByDate")
            .optional()
            .isBoolean().withMessage("Wrong format of query parameter 'orderByDate'.")
    ],
    rois          : [
        query("rois")
            .optional()
            .custom(v => v.split(",").every(e => roiEnum.indexOf(e) >= 0) && new Set(v.split(",")).size === v.split(",").length)
            .withMessage("Wrong format of query parameter 'rois'.")
    ]
};


// Validation chains for common body properties
export const b = {
    rois: [
        body("rois")
            .not().isEmpty().withMessage("Missing property 'rois'.")
            .isArray().withMessage("Wrong format of property 'rois'."),
        body("rois.*")
            .isIn(e.roi).withMessage("Invalid value of one of the properties of 'rois'."),
    ]
};
