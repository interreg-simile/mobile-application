import path from "path";
import yaml from "yamljs";

import { body, query, oneOf } from "express-validator";
import { vQuery, enums, vBody, vCoords } from "../../utils/common-validations";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./src/config/models.yaml")).observations;


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast,
    ...vQuery.includeDeletedAdmin,
];


// Validation chain for the body of the "post" and "put" requests
export const observation = [
    body("position")
        .not().isEmpty().withMessage("Missing property 'position'."),
    ...vCoords("position.coordinates", false),
    body("weather")
        .not().isEmpty().withMessage("Missing property 'weather'."),
    body("details")
        .optional(),
    body("measures")
        .optional()
];


// Validation chain for the body of the "patch" requests
export const patch = [];
