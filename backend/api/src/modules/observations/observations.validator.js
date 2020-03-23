/**
 * @fileoverview This file contains express-validator validation chains regarding the `observations` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import yaml from "yamljs";

import { body, oneOf, query } from "express-validator";
import { vQuery, vCoords, vCode, vPath } from "../../utils/common-validations";


// Load the configurations in JSON format
const conf    = yaml.load(path.resolve("./config/models.yaml")).observations;
const crsConf = (yaml.load(path.resolve("./config/default.yaml"))).crs;


// Validation for the crs query parameter
export const vCrs = [
    query("crs").optional().isInt({
        min                 : Math.min(...Object.keys(crsConf).map(v => parseInt(v))),
        max                 : Math.max(...Object.keys(crsConf).map(v => parseInt(v))),
        allow_leading_zeroes: false
    })
];

// Validation for the mode query parameter
export const vMode = [
    query("mode").optional().trim().custom(v => ["json", "geojson"].includes(v.toLowerCase()))
];


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includeDeletedAdmin,
    query("minimalRes").optional().isBoolean(),
    query("excludeOutOfRois").optional().isBoolean(),
    ...vCrs,
    ...vMode
];

// Validation chain for the query parameters of the "get by id" route
export const getByIdQuery = [...vPath.id, ...vCrs, ...vMode];

// Validation chain for the query parameters of the "post" route
const postQuery = [query("minimalRes").optional().isBoolean()];


const vPosition = [

    body("position.type").isEmpty(),

    ...vCoords("position.coordinates", false),

    body("position.accuracy").optional().isFloat(),

    body("position.roi").optional().isMongoId()

];


const vWeather = [

    body("weather.temperature").optional().isFloat(),

    ...vCode("weather.sky", conf.weather.sky.min, conf.weather.sky.max, false, false),

    body("weather.wind").optional().isFloat(),

];


function vDetailCheck(detail) {

    return [body(`details.${detail}.checked`).optional().isBoolean()]

}

const vAlgae = [

    ...vDetailCheck("algae"),

    ...vCode("details.algae.extension", conf.details.algae.extension.min, conf.details.algae.extension.max),

    ...vCode("details.algae.look", conf.details.algae.look.min, conf.details.algae.look.max),

    ...vCode("details.algae.colour", conf.details.algae.colour.min, conf.details.algae.colour.max),

    body("details.algae.colour.iridescent").optional().isBoolean()

];

const vFoams = [

    ...vDetailCheck("foams"),

    ...vCode("details.foams.extension", conf.details.foams.extension.min, conf.details.foams.extension.max),

    ...vCode("details.foams.look", conf.details.foams.look.min, conf.details.foams.look.max),

    ...vCode("details.foams.height", conf.details.foams.height.min, conf.details.foams.height.max)

];

const vOils = [

    ...vDetailCheck("oils"),

    ...vCode("details.oils.extension", conf.details.oils.extension.min, conf.details.oils.extension.max),

    ...vCode("details.oils.type", conf.details.oils.type.min, conf.details.oils.type.max)

];

const vLitters = [

    ...vDetailCheck("litters"),

    ...vCode("details.litters.quantity", conf.details.litters.quantity.min, conf.details.litters.quantity.max),

    ...vCode("details.litters.type", conf.details.litters.type.min, conf.details.litters.type.max, true)

];

const vOdours = [

    ...vDetailCheck("odours"),

    ...vCode("details.odours.intensity", conf.details.odours.intensity.min, conf.details.odours.intensity.max),

    ...vCode("details.odours.origin", conf.details.odours.origin.min, conf.details.odours.origin.max, true)

];

const vOutlets = [

    ...vDetailCheck("outlets"),

    body("details.outlets.inPlace").optional().isBoolean(),

    ...vCode("details.outlets.terminal", conf.details.outlets.terminal.min, conf.details.outlets.terminal.max),

    ...vCode("details.outlets.colour", conf.details.outlets.colour.min, conf.details.outlets.colour.max),

    body("details.outlets.vapour").optional().isBoolean(),

    body("details.outlets.signage").optional().isBoolean(),

    body("details.outlets.signagePhoto").isEmpty(),

    body("details.outlets.prodActNearby").optional().isBoolean(),

    body("details.outlets.prodActNearbyDetails").optional().escape().trim()

];

function vSubFauna(property) {

    return [
        ...vDetailCheck(`fauna.${property}`),
        body(`fauna.${property}.number`).optional().isInt({ min: 0 }),
        body(`fauna.${property}.deceased`).optional().isBoolean(),
        ...vDetailCheck(`fauna.${property}.abnormal`),
        body(`details.fauna.${property}.abnormal.details`).optional().escape().trim(),
        ...vDetailCheck(`fauna.${property}.alien`),
        ...vCode(`details.fauna.${property}.alien.species`,
            conf.details.fauna[property].alien.min,
            conf.details.fauna[property].alien.max,
            true)
    ]

}

const vFauna = [

    ...vDetailCheck("fauna"),
    ...vSubFauna("fish"),
    ...vSubFauna("birds"),
    ...vSubFauna("molluscs"),
    ...vSubFauna("crustaceans"),
    ...vSubFauna("turtles")

];

const vDetails = [...vAlgae, ...vFoams, ...vOils, ...vLitters, ...vOdours, ...vOutlets, ...vFauna];


function vInstrument(field) {

    return [

        body(`${field}.instrument`).if(body(field).exists()).not().isEmpty(),

        body(`${field}.instrument.type.code`).if(body(field).exists())
            .not().isEmpty()
            .isInt({
                min                 : conf.measures.instrument.type.min,
                max                 : conf.measures.instrument.type.max,
                allow_leading_zeroes: false
            }),

        body(`${field}.instrument.precision`).optional().isNumeric(),

        body(`${field}.instrument.details`).optional().escape().trim(),

    ]

}

const vTransparency = [

    body("measures.transparency.val")
        .if(body("measures.transparency").exists()).not().isEmpty().isNumeric(),

    ...vInstrument("measures.transparency")

];

const vTemperature = [

    body("measures.temperature.multiple")
        .if(body("measures.temperature").exists()).not().isEmpty().isBoolean(),

    body("measures.temperature.val")
        .if(body("measures.temperature").exists()).not().isEmpty().isArray(),

    body("measures.temperature.val.*.depth")
        .if(body("measures.temperature").exists()).not().isEmpty().isNumeric(),

    body("measures.temperature.val.*.val")
        .if(body("measures.temperature").exists()).not().isEmpty().isNumeric(),

    ...vInstrument("measures.temperature")

];

const vPh = [

    body("measures.ph.multiple")
        .if(body("measures.ph").exists()).not().isEmpty().isBoolean(),

    body("measures.ph.val")
        .if(body("measures.ph").exists()).not().isEmpty().isArray(),

    body("measures.ph.val.*.depth")
        .if(body("measures.ph").exists()).not().isEmpty().isNumeric(),
    body("measures.ph.val.*.val")
        .if(body("measures.ph").exists()).not().isEmpty().isNumeric(),

    ...vInstrument("measures.ph")

];

const vOxygen = [

    body("measures.oxygen.multiple")
        .if(body("measures.oxygen").exists()).not().isEmpty().isBoolean(),

    body("measures.oxygen.percentage")
        .if(body("measures.oxygen").exists()).not().isEmpty().isBoolean(),

    body("measures.oxygen.val")
        .if(body("measures.oxygen").exists()).not().isEmpty().isArray(),

    body("measures.oxygen.val.*.depth")
        .if(body("measures.oxygen").exists()).not().isEmpty().isNumeric(),
    body("measures.oxygen.val.*.val")
        .if(body("measures.oxygen").exists()).not().isEmpty().isNumeric(),

    ...vInstrument("measures.oxygen")

];

const vBacteria = [

    oneOf([
        body("measures.bacteria.escherichiaColi")
            .if(body("measures.bacteria").exists()).not().isEmpty().isNumeric(),
        body("measures.bacteria.enterococci")
            .if(body("measures.bacteria").exists()).not().isEmpty().isNumeric(),
    ])

];

const vMeasures = [...vTransparency, ...vTemperature, ...vPh, ...vOxygen, ...vBacteria];


// Validation chain for the body of the "post" and "put" requests
export const observation = [
    ...postQuery,
    body("_id").isEmpty(),
    // body("uid").isEmpty(),
    body("photos").isEmpty(),
    ...vPosition,
    ...vWeather,
    ...vDetails,
    ...vMeasures,
    body("other").optional().escape().trim(),
    body("markedForDeletion").isEmpty()
];


// Validation chain for the body of the "patch" requests
export const patch = [];
