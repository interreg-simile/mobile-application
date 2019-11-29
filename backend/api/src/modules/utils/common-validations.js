import { oneOf, param, query } from "express-validator";

export const idValidation = [
    param("idValidation").isMongoId().withMessage("Wrong format of path parameter 'idValidation'.")
];


/**
 * Returns an express-validator that checks if a given query parameter is not existing or is a boolean.
 *
 * @param {string} param - The query parameter.
 * @return {Object} A middleware instance.
 */
export function validateBooleanQueryParam(param) {
    return oneOf([query(param).not().exists(), query(param).isBoolean()], `Invalid value of query parameter '${param}'.`)
}
