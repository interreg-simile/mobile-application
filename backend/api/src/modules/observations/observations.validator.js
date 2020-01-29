import { body, query, oneOf } from "express-validator";
import { vQuery, enums, vBody } from "../../utils/common-validations";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast,
    ...vQuery.includeDeletedAdmin,
];


// Validation chain for the body of the "post" and "put" requests
export const observation = [];


// Validation chain for the body of the "patch" requests
export const patch = [];
