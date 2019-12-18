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
    sort          : [
        query("sort")
            .optional()
            .custom((v, { req }) => vSort(v, req.config.sort))
            .withMessage("Wrong format of query parameter 'sort'.")
    ],
    rois          : [
        query("rois")
            .optional()
            .custom(v => v.split(",").every(i => enums.roi.indexOf(i) >= 0) && new Set(v.split(",")).size === v.split(",").length)
            .withMessage("Wrong format of query parameter 'rois'.")
    ]
};


export function vSort(val, allowedFields) {

    console.log(val, allowedFields);

    if (!allowedFields) return false;

    console.log(val.split(","));

    const fields = val.split(",");

    for (const f of fields) {

        const r = new RegExp("[+-]" + allowedFields.join("|"));

        console.log(`${f}: ${r.test(f)}`)

    }

    const r = val.split(",").every(f => new RegExp("[+-]" + allowedFields.join("|")).test(f));

    // [+-]dateStart|[+-]dateEnd

    console.log(r);

    return r;

}


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
