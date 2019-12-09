import { body } from "express-validator";

import { q, b } from "../../utils/common-validations";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [...q.includePast, ...q.includeDeleted, ...q.orderByDate, ...q.rois];


// Validation chain for the body of the "post" and "put" requests
export const communication = [
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
    body("dateStart")
        .not().isEmpty().withMessage("Missing property 'dateStart'.")
        .isISO8601().withMessage("Wrong format of property 'dateStart'."),
    body("dateEnd")
        .not().isEmpty().withMessage("Missing property 'dateEnd'.")
        .isISO8601().withMessage("Wrong format of property 'dateEnd'."),
    ...b.rois,
    body("markedForDeletion")
        .isEmpty().withMessage("Forbidden value of property 'markedForDeletion'.")
];
