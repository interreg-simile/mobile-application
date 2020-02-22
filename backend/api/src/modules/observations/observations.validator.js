/**
 * @fileoverview This file contains express-validator validation chains regarding the `observations` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import yaml from "yamljs";

import { body, oneOf } from "express-validator";
import { vQuery, vCoords, vCode } from "../../utils/common-validations";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./config/models.yaml")).observations;


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [
    ...vQuery.includePast,
    ...vQuery.includeDeletedAdmin,
];


const vPosition = [

    body("position.type").isEmpty(),

    ...vCoords("position.coordinates", false),

    body("position.accuracy").optional().isFloat(),

    body("position.custom").not().isEmpty().isBoolean(),

    body("position.roi").optional().isMongoId()

];


const vWeather = [

    body("weather.temperature").isFloat(),

    ...vCode("weather.sky", conf.weather.sky.min, conf.weather.sky.max, false, false),

    body("weather.wind").optional().isFloat(),

];


const vAlgae = [

    ...vCode("details.algae.extension", conf.details.algae.extension.min, conf.details.algae.extension.max),

    ...vCode("details.algae.look", conf.details.algae.look.min, conf.details.algae.look.max),

    ...vCode("details.algae.colour", conf.details.algae.colour.min, conf.details.algae.colour.max),

    body("details.algae.colour.iridescent").optional().isBoolean()

];

const vFoams = [

    ...vCode("details.foams.extension", conf.details.foams.extension.min, conf.details.foams.extension.max),

    ...vCode("details.foams.look", conf.details.foams.look.min, conf.details.foams.look.max),

    ...vCode("details.foams.height", conf.details.foams.height.min, conf.details.foams.height.max)

];

const vOils = [

    ...vCode("details.oils.extension", conf.details.oils.extension.min, conf.details.oils.extension.max),

    ...vCode("details.oils.type", conf.details.oils.type.min, conf.details.oils.type.max)

];

const vLitters = [

    ...vCode("details.litters.quantity", conf.details.litters.quantity.min, conf.details.litters.quantity.max),

    ...vCode("details.litters.type", conf.details.litters.type.min, conf.details.litters.type.max, true)

];

const vOdours = [

    ...vCode("details.odours.intensity", conf.details.odours.intensity.min, conf.details.odours.intensity.max),

    ...vCode("details.odours.origin", conf.details.odours.origin.min, conf.details.odours.origin.max, true)

];

const vOutlets = [

    body("details.outlets.inPlace").optional().isBoolean(),

    ...vCode("details.outlets.terminal", conf.details.outlets.terminal.min, conf.details.outlets.terminal.max),

    ...vCode("details.outlets.colour", conf.details.outlets.colour.min, conf.details.outlets.colour.max),

    body("details.outlets.vapour").optional().isBoolean(),

    body("details.outlets.signage").optional().isBoolean(),

    body("details.outlets.signagePhoto").isEmpty(),

    body("details.outlets.prodActNearby").optional().isBoolean(),

    body("details.outlets.prodActNearbyDetails").optional().isAscii().escape().trim()

];

const vFauna = [

    body("details.fauna.deceased.fish.checked").optional().isBoolean(),
    body("details.fauna.deceased.fish.details").optional().isAscii().escape().trim(),
    
    body("details.fauna.deceased.birds.checked").optional().isBoolean(),
    body("details.fauna.deceased.birds.details").optional().isAscii().escape().trim(),

    body("details.fauna.deceased.other.checked").optional().isBoolean(),
    body("details.fauna.deceased.other.details").optional().isAscii().escape().trim(),

    body("details.fauna.abnormal.fish.checked").optional().isBoolean(),
    body("details.fauna.abnormal.fish.details").optional().isAscii().escape().trim(),

    body("details.fauna.abnormal.birds.checked").optional().isBoolean(),
    body("details.fauna.abnormal.birds.details").optional().isAscii().escape().trim(),

    body("details.fauna.abnormal.other.checked").optional().isBoolean(),
    body("details.fauna.abnormal.other.details").optional().isAscii().escape().trim(),

    body("details.fauna.alienSpecies.crustaceans.checked").optional().isBoolean(),
    body("details.fauna.alienSpecies.crustaceans.details").optional().isAscii().escape().trim(),

    body("details.fauna.alienSpecies.molluscs.checked").optional().isBoolean(),
    body("details.fauna.alienSpecies.molluscs.details").optional().isAscii().escape().trim(),

    body("details.fauna.alienSpecies.turtles.checked").optional().isBoolean(),
    body("details.fauna.alienSpecies.turtles.details").optional().isAscii().escape().trim(),

    body("details.fauna.alienSpecies.fish.checked").optional().isBoolean(),
    body("details.fauna.alienSpecies.fish.details").optional().isAscii().escape().trim(),

    body("details.fauna.alienSpecies.other.checked").optional().isBoolean(),
    body("details.fauna.alienSpecies.other.details").optional().isAscii().escape().trim(),

];

const vDetails = [...vAlgae, ...vFoams, ...vOils, ...vLitters, ...vOdours, ...vOutlets, ...vFauna,
    body("details.other").optional().isAscii().escape().trim()];


function vInstrument(field) {

    return [

        body(`${field}.instrument`).if(body(field).exists()).not().isEmpty(),

        body(`${field}.instrument.professional`).if(body(field).exists()).not().isEmpty().isBoolean(),

        body(`${field}.instrument.brand`).optional().isAscii().escape().trim(),

        body(`${field}.instrument.precision`).optional().isAscii().escape().trim(),

        body(`${field}.instrument.details`).optional().isAscii().escape().trim(),

    ]

}

function vTransparency() {

    return [

        body("measures.transparency.val")
            .if(body("measures.transparency").exists()).not().isEmpty().isNumeric(),

        ...vInstrument("measures.transparency")

    ]

}

function vTemperature() {

    return [

        body("measures.temperature.multiple")
            .if(body("measures.temperature").exists()).not().isEmpty().isBoolean(),

        body("measures.temperature.val")
            .if(body("measures.temperature").exists()).not().isEmpty().isArray(),

        body("measures.temperature.val.*.depth")
            .if(body("measures.temperature").exists()).not().isEmpty().isNumeric(),
        body("measures.temperature.val.*.val")
            .if(body("measures.temperature").exists()).not().isEmpty().isNumeric(),

        ...vInstrument("measures.temperature")

    ]

}

function vPh() {

    return [

        body("measures.ph.multiple")
            .if(body("measures.ph").exists()).not().isEmpty().isBoolean(),

        body("measures.ph.val")
            .if(body("measures.ph").exists()).not().isEmpty().isArray(),

        body("measures.ph.val.*.depth")
            .if(body("measures.ph").exists()).not().isEmpty().isNumeric(),
        body("measures.ph.val.*.val")
            .if(body("measures.ph").exists()).not().isEmpty().isNumeric(),

        ...vInstrument("measures.ph")

    ]

}

function vOxygen() {

    return [

        body("measures.oxygen.multiple")
            .if(body("measures.oxygen").exists()).not().isEmpty().isBoolean(),

        body("measures.oxygen.val")
            .if(body("measures.oxygen").exists()).not().isEmpty().isArray(),

        body("measures.oxygen.val.*.depth")
            .if(body("measures.oxygen").exists()).not().isEmpty().isNumeric(),
        oneOf([
            body("measures.oxygen.val.*.concentration")
                .if(body("measures.oxygen").exists()).not().isEmpty().isNumeric(),
            body("measures.oxygen.val.*.percentage")
                .if(body("measures.oxygen").exists()).not().isEmpty().isNumeric(),
        ]),

        ...vInstrument("measures.oxygen")

    ]

}

function vBacteria() {

    return [

        oneOf([
            body("measures.bacteria.escherichiaColi")
                .if(body("measures.bacteria").exists()).not().isEmpty().isNumeric(),
            body("measures.bacteria.enterococci")
                .if(body("measures.bacteria").exists()).not().isEmpty().isNumeric(),
        ])

    ]


}


// Validation chain for the body of the "post" and "put" requests
export const observation = [
    body("_id").isEmpty(),
    body("uid").isEmpty(),
    body("photos").isEmpty(),
    ...vPosition,
    ...vWeather,
    ...vDetails,
    body("markedForDeletion").isEmpty(),
    body("createdAt").isEmpty(),
    body("upadtedAt").isEmpty()
];


// Validation chain for the body of the "patch" requests
export const patch = [];
