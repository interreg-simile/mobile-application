/**
 * @fileoverview This file contains express-validator validation chains regarding the `observations` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import yaml from "yamljs";

import { body, oneOf } from "express-validator";
import { vQuery,  vCoords, vDCode, vArrayDCode } from "../../utils/common-validations";


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

        body("position.accuracy").optional().isFloat(),

        body("position.custom").not().isEmpty().isBoolean(),

        body("position.address").not().isEmpty().isAscii().escape().trim(),

        ...vDCode("position.lake", conf.position.lake.min, conf.position.lake.max)

    ]

}


function vWeather() {

    return [

        body("weather.temperature").not().isEmpty().isFloat(),

        ...vDCode("weather.sky", conf.weather.sky.min, conf.weather.sky.max),

        body("weather.wind").not().isEmpty().isFloat(),

    ]

}


function vAlgae() {

    return [

        ...vDCode("details.algae.extension", conf.details.algae.extension.min, conf.details.algae.extension.max, true),

        ...vDCode("details.algae.look", conf.details.algae.look.min, conf.details.algae.look.max, true),

        ...vDCode("details.algae.colour", conf.details.algae.colour.min, conf.details.algae.colour.max, true),

        body("details.algae.colour.iridescent").optional().isBoolean()

    ]

}

function vFoams() {

    return [

        ...vDCode("details.foams.extension", conf.details.foams.extension.min, conf.details.foams.extension.max, true),

        ...vDCode("details.foams.look", conf.details.foams.look.min, conf.details.foams.look.max, true),

        ...vDCode("details.foams.height", conf.details.foams.height.min, conf.details.foams.height.max, true)

    ]

}

function vOils() {

    return [

        ...vDCode("details.oils.extension", conf.details.oils.extension.min, conf.details.oils.extension.max, true),

        ...vDCode("details.oils.type", conf.details.oils.type.min, conf.details.oils.type.max, true)

    ]

}

function vLitters() {

    return [

        ...vDCode("details.litters.quantity", conf.details.litters.quantity.min, conf.details.litters.quantity.max, true),

        ...vArrayDCode("details.litters.type", conf.details.litters.type.min, conf.details.litters.type.max, true)

    ]

}

function vOdours() {

    return [

        ...vDCode("details.odours.intensity", conf.details.odours.intensity.min, conf.details.odours.intensity.max, true),

        ...vArrayDCode("details.odours.origin", conf.details.odours.origin.min, conf.details.odours.origin.max, true)

    ]

}

function vOutlets() {

    return [

        body("details.outlets.inPlace").optional().isBoolean(),

        ...vDCode("details.outlets.terminal", conf.details.outlets.terminal.min, conf.details.outlets.terminal.max, true),

        ...vDCode("details.outlets.colour", conf.details.outlets.colour.min, conf.details.outlets.colour.max, true),

        body("details.outlets.vapour").optional().isBoolean(),

        body("details.outlets.signage").optional().isBoolean(),

        body("details.outlets.prodActNearby").optional().isBoolean(),

        body("details.outlets.prodActNearbyDetails").optional().isAscii().escape().trim()

    ]

}

function vFauna() {

    return [

        body("details.fauna.deceased.fish").optional().isBoolean(),
        body("details.fauna.deceased.birds").optional().isBoolean(),
        body("details.fauna.deceased.other").optional().isAscii().escape().trim(),

        body("details.fauna.abnormal.fish").optional().isBoolean(),
        body("details.fauna.abnormal.birds").optional().isBoolean(),
        body("details.fauna.abnormal.other").optional().isAscii().escape().trim(),
        body("details.fauna.abnormal.description").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.crustaceans.present").optional().isBoolean(),
        body("details.fauna.alienSpecies.crustaceans.details").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.molluscs.present").optional().isBoolean(),
        body("details.fauna.alienSpecies.molluscs.details").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.turtles.present").optional().isBoolean(),
        body("details.fauna.alienSpecies.turtles.details").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.fish.present").optional().isBoolean(),
        body("details.fauna.alienSpecies.fish.details").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.birds.present").optional().isBoolean(),
        body("details.fauna.alienSpecies.birds.details").optional().isAscii().escape().trim(),

        body("details.fauna.alienSpecies.other").optional().isAscii().escape().trim()

    ]

}


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
    ...vPosition(),
    ...vWeather(),
    ...vAlgae(),
    ...vFoams(),
    ...vOils(),
    ...vLitters(),
    ...vOdours(),
    ...vOutlets(),
    ...vFauna(),
    body("details.other").optional().isAscii().escape().trim(),
    ...vTransparency(),
    ...vTemperature(),
    ...vPh(),
    ...vOxygen(),
    ...vBacteria()
];


// Validation chain for the body of the "patch" requests
export const patch = [];
