import { body } from "express-validator";

import { vQuery, vBody } from "../../utils/common-validations";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [...vQuery.includePast, ...vQuery.includeDeletedAdmin, ...vQuery.sort, ...vQuery.rois];


// Validation chain for the body of the "post" and "put" requests
export const alert = [
    body("titleIta")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'titleIta'."),
    body("titleEng")
        .optional()
        .trim().escape(),
    body("contentIta")
        .trim().escape()
        .not().isEmpty().withMessage("Missing property 'descriptionIta'."),
    body("contentEng")
        .optional()
        .trim().escape(),
    body("dateStart")
        .not().isEmpty().withMessage("Missing property 'dateStart'.")
        .isISO8601().withMessage("Wrong format of property 'dateStart'."),
    body("dateEnd")
        .not().isEmpty().withMessage("Missing property 'dateEnd'.")
        .isISO8601().withMessage("Wrong format of property 'dateEnd'."),
    ...vBody.rois,
    body("markedForDeletion")
        .isEmpty().withMessage("Forbidden value of property 'markedForDeletion'.")
];
