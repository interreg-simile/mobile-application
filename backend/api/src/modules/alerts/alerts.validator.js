/**
 * @fileoverview This file contains express-validator validation chains regarding the `alerts` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body } from "express-validator";

import { vQuery, vBody, vDCode, vArrayDCode } from "../../utils/common-validations";
import yaml from "yamljs";
import path from "path";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./config/models.yaml")).alerts;


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast,
    ...vQuery.includeDeletedAdmin,
    ...vQuery.sort,
    ...vQuery.rois(conf.rois.min, conf.rois.max)
];


// Validation chain for the body of the "post" and "put" requests
export const alert = [

    body("titleIta").trim().escape().not().isEmpty(),

    body("titleEng").optional().trim().escape(),

    body("contentIta").trim().escape().not().isEmpty(),

    body("contentEng").optional().trim().escape(),

    body("dateStart").not().isEmpty().isISO8601(),

    body("dateEnd").not().isEmpty().isISO8601()
        .custom((v, { req }) => new Date(v).getTime() > new Date(req.body.dateStart).getTime()),

    body("rois.codes")
        .not().isEmpty()
        .isArray({min: 1})
        .custom(v => !(v.includes(1) && v.length > 1))
        .custom(v => new Set(v).size === v.length),

    body("rois.codes.*").not().isEmpty().isInt({min: conf.rois.min, max: conf.rois.max}),


];


// Validation chain for the body of the "patch" requests
export const patch = [

    body("titleIta").optional().trim().escape().not().isEmpty(),

    body("titleEng").optional().trim().escape(),

    body("contentIta").optional().trim().escape().not().isEmpty(),

    body("contentEng").optional().trim().escape(),

    body("dateStart").optional().not().isEmpty().isISO8601(),

    body("dateEnd").optional().not().isEmpty().isISO8601(),

    body("rois.codes")
        .optional()
        .not().isEmpty()
        .isArray({min: 1})
        .custom(v => !(v.includes(1) && v.length > 1))
        .custom(v => new Set(v).size === v.length),

    body("rois.codes.*").not().isEmpty().isInt({min: conf.rois.min, max: conf.rois.max}),


];
