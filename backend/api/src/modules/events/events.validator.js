/**
 * @fileoverview This file contains express-validator validation chains regarding the `events` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body, query, oneOf } from "express-validator";
import { vQuery, vCoords } from "../../utils/common-validations";
import yaml from "yamljs";
import path from "path";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./config/models.yaml")).events;


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [

    ...vQuery.includePast,

    ...vQuery.includeDeletedAdmin,

    ...vQuery.sort,

    ...vQuery.rois(conf.rois.min, conf.rois.max),

    query("city").optional().trim().escape(),

    query("postalCode").optional().isPostalCode("any"),

    query("coords").optional().isLatLong(),

    query("buffer").optional().isFloat({ min: 0.00 })

];


// Validation chain for the body of the "post" and "put" requests
export const event = [

    body("titleIta").trim().escape().not().isEmpty(),

    body("titleEng").optional().trim().escape(),

    body("descriptionIta").trim().escape().not().isEmpty(),

    body("descriptionEng").optional().trim().escape(),

    ...vCoords("coordinates", false),

    body("address").not().isEmpty(),

    body("address.main").trim().escape().not().isEmpty(),

    body("address.civic").trim().escape().not().isEmpty(),

    body("address.city").trim().escape().not().isEmpty(),

    body("address.postalCode").not().isEmpty().isPostalCode("any"),

    body("address.province").trim().escape().not().isEmpty().isLength({ min: 2, max: 2 }),

    body("address.country.code").not().isEmpty().isInt({ min: conf.countries.min, max: conf.countries.max }),

    body("rois.codes")
        .not().isEmpty()
        .isArray({min: 1})
        .custom(v => !(v.includes(1) && v.length > 1))
        .custom(v => new Set(v).size === v.length),

    body("rois.codes.*").not().isEmpty().isInt({min: conf.rois.min, max: conf.rois.max}),

    body("date").not().isEmpty().isISO8601(),

    body("contacts").not().isEmpty(),

    oneOf([
        body("contacts.mail").not().isEmpty().isEmail().normalizeEmail(),
        body("contacts.phone").not().isEmpty().isMobilePhone("any", { strictMode: true })
    ]),

    body("participants").optional().isInt({ min: 0 })

];


// Validation chain for the body of the "patch" requests
export const patch = [

    body("titleIta").optional().trim().escape().not().isEmpty(),

    body("titleEng").optional().trim().escape(),

    body("descriptionIta").optional().trim().escape().not().isEmpty(),

    body("descriptionEng").optional().trim().escape(),

    ...vCoords("coordinates", true),

    body("address").optional().not().isEmpty(),

    body("address.main").optional().trim().escape().not().isEmpty(),

    body("address.civic").optional().trim().escape().not().isEmpty(),

    body("address.city").optional().trim().escape().not().isEmpty(),

    body("address.postalCode").optional().not().isEmpty().isPostalCode("any"),

    body("address.province").optional().trim().escape().not().isEmpty().isLength({ min: 2, max: 2 }),

    body("address.country.code").optional().not().isEmpty().isInt({ min: conf.countries.min, max: conf.countries.max }),

    body("rois.codes")
        .optional()
        .not().isEmpty()
        .isArray({min: 1})
        .custom(v => !(v.includes(1) && v.length > 1))
        .custom(v => new Set(v).size === v.length),

    body("rois.codes.*").not().isEmpty().isInt({min: conf.rois.min, max: conf.rois.max}),

    body("date").optional().not().isEmpty().isISO8601(),

    body("contacts").optional().not().isEmpty(),

    oneOf([
        body("contacts.mail").optional().not().isEmpty().isEmail().normalizeEmail(),
        body("contacts.phone").optional().not().isEmpty().isMobilePhone("any", { strictMode: true })
    ]),

    body("participants").optional().isInt({ min: 0 })

];
