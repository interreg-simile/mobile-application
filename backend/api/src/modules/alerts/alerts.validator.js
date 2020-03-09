/**
 * @fileoverview This file contains express-validator validation chains regarding the `alerts` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body } from "express-validator";

import { vQuery } from "../../utils/common-validations";
import yaml from "yamljs";
import path from "path";
import { appConf } from "../../middlewares/load-config";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast,
    ...vQuery.includeDeletedAdmin,
    ...vQuery.sort
];


// Validation chain for the body of the "post" and "put" requests
export const alert = [

    body("title")
        .not().isEmpty()
        .custom(v => {
            return (
                Object.keys(v).includes("it") &&
                Object.keys(v).includes("en") &&
                Object.keys(v).every(k => appConf.lngs.includes(k))
            )
        }),

    body("title.*").trim().escape(),

    body("content")
        .not().isEmpty()
        .custom(v => {
            return (
                Object.keys(v).includes("it") &&
                Object.keys(v).includes("en") &&
                Object.keys(v).every(k => appConf.lngs.includes(k))
            )
        }),

    body("content.*").trim().escape(),

    body("dateEnd").not().isEmpty().isISO8601()
        .custom(v => new Date(v).getTime() > new Date().getTime()),

    body("markedForDeletion").isEmpty()

];


// Validation chain for the body of the "patch" requests
export const patch = []; // ToDo
