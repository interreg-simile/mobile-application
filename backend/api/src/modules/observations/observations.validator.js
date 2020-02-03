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


function vPosition() {

    return [

        ...vCoords("position.coordinates", false),

        body("position.accuracy")
            .optional()
            .isFloat().withMessage('validation.wrongFormat;{"name": "position.accuracy"}'),

        body("position.custom")
            .not().isEmpty().withMessage('validation.missing;{"name": "position.custom"}')
            .isBoolean().withMessage('validation.wrongFormat;{"name": "position.custom"}'),

        body("position.address")
            .not().isEmpty().withMessage('validation.missing;{"name": "position.address"}')
            .isAscii().withMessage('validation.wrongFormat;{"name": "position.address"}')
            .escape().trim(),

        body("position.lake.dCode.code")
            .not().isEmpty().withMessage('validation.missing;{"name": "position.lake.dCode.code"}')
            .isInt({ min: conf.position.lake.min, max: conf.position.lake.max, allow_leading_zeroes: false })
            .withMessage('validation.invalidValue;{"name": "position.lake.dCode.code"}')

    ]

}


function vWeather() {

    return [

        body("weather.temperature")
            .not().isEmpty().withMessage('validation.missing;{"name": "weather.temperature"}')
            .isFloat().withMessage('validation.wrongFormat;{"name": "weather.temperature"}'),

        body("weather.sky.dCode.code")
            .not().isEmpty().withMessage('validation.missing;{"name": "weather.sky.dCode.code"}')
            .isInt({ min: conf.weather.sky.min, max: conf.weather.sky.max, allow_leading_zeroes: false })
            .withMessage('validation.invalidValue;{"name": "weather.sky.dCode.code"}'),

        body("weather.wind")
            .not().isEmpty().withMessage('validation.missing;{"name": "weather.wind"}')
            .isFloat().withMessage('validation.wrongFormat;{"name": "weather.wind"}'),

    ]

}


function vAlgae() {

    return [

        body("details.algae.extension.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.algae.extension.min,
                max                 : conf.details.algae.extension.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.algae.extension.dCode.code"}'),

        body("details.algae.look.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.algae.look.min,
                max                 : conf.details.algae.look.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.algae.look.dCode.code"}'),

        body("details.algae.colour.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.algae.colour.min,
                max                 : conf.details.algae.colour.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.algae.colour.dCode.code"}'),

        body("details.algae.colour.iridescent")
            .optional()
            .isBoolean().withMessage('validation.wrongFormat;{"name": "details.algae.colour.iridescent"}'),

    ]

}

function vFoams() {

    return [

        body("details.foams.extension.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.foams.extension.min,
                max                 : conf.details.foams.extension.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.foams.extension.dCode.code"}'),

        body("details.foams.look.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.foams.look.min,
                max                 : conf.details.foams.look.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.foams.look.dCode.code"}'),

        body("details.foams.height.dCode.code")
            .optional()
            .isInt({
                min                 : conf.details.foams.height.min,
                max                 : conf.details.foams.height.max,
                allow_leading_zeroes: false
            })
            .withMessage('validation.invalidValue;{"name": "details.foams.height.dCode.code"}'),

    ]

}


// Validation chain for the body of the "post" and "put" requests
export const observation = [...vPosition(), ...vWeather(), ...vAlgae(), ...vFoams()];


// Validation chain for the body of the "patch" requests
export const patch = [];
