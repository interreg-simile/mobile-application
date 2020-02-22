/**
 * @fileoverview This file contains common express-validator validation chains.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body, param, query, ValidationChain } from "express-validator";


/** Validation chains for common path parameters */
export const vPath = {

    // Mongoose id validation
    id: [param("id").isMongoId()]

};


/** Validation chains for common query parameters */
export const vQuery = {

    includePast: [query("includePast").optional().isBoolean()],

    includeDeleted: [query("includeDeleted").optional().isBoolean()],

    includeDeletedAdmin: [
        query("includeDeleted")
            .optional()
            .custom((v, { req }) => !(v !== "false" && !req.isAdmin))
            .isBoolean()
    ],

    sort: [query("sort").optional().custom((v, { req }) => vSort(v, req.config.sort))],

    rois: (min, max) => {

        return [

            query("rois")
                .optional()
                .custom(v => {

                    return v.split(",").every(r => parseInt(r) <= max && parseInt(r) > min) &&
                        new Set(v.split(",")).size === v.split(",").length;

                })

        ]

    }

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


/**
 * Creates a validation chain for a generic coordinates field.
 *
 * @param {string} field - The chain that brings to the field.
 * @param {boolean} opt - True if the field could be optional.
 * @return {ValidationChain[]} The validation chain.
 */
export function vCoords(field, opt) {

    // Save the validation of the field
    const validation = body(field);

    // If the field is optional, append the optional validation
    if (opt) validation.optional();

    // Return the field validation
    return [

        validation.not().isEmpty().isArray({ min: 2, max: 2 })
            .custom(v => !(v[0] < -180.0 || v[0] > 180.0 || v[1] < -90.0 || v[1] > 90.0)),

        body(`${field}.*`).not().isEmpty().isFloat()

    ]

}


/**
 * Creates a validation chain for a generic "code" field.
 *
 * @param {string} field - The name of the field.
 * @param {number} min - The minimum accepted value.
 * @param {number} max - The maximum accepted value.
 * @param {boolean} [isArray=true] - True if the field is an array.
 * @param {boolean} [opt=true] - True if the field can be optional
 * @return {Array<ValidationChain>} The validation chain.
 */
export function vCode(field, min, max, isArray = false, opt = true) {

    // Save the validation of the field
    const validation = body(`${field}.${isArray ? "*." : ""}code`);

    // If the field is optional, append the optional validation
    if (opt) validation.optional();

    // Return the field validation
    return [validation.not().isEmpty().isInt({ min: min, max: max, allow_leading_zeroes: false })];

}
