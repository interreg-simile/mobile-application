/**
 * @fileoverview This file contains express-validator validation chains regarding the `events` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { body, query, oneOf } from "express-validator";
import mongoose from "mongoose";
import yaml from "yamljs";
import path from "path";

import { vQuery, vCoords } from "../../utils/common-validations";
import { appConf } from "../../middlewares/load-config";


// Validation chain for the query parameters of the "get all" route
export const getAllQuery = [

    ...vQuery.includePast,

    ...vQuery.includeDeletedAdmin,

    ...vQuery.sort

];


// Validation chain for the body of the "post" and "put" requests
export const event = [

    body("title")
        .not().isEmpty()
        .custom(v => Object.keys(v).some(k => k === "it") && Object.keys(v).every(k => appConf.lngs.includes(k))),

    body("title.*").trim().escape(),

    body("description")
        .not().isEmpty()
        .custom(v => Object.keys(v).some(k => k === "it") && Object.keys(v).every(k => appConf.lngs.includes(k))),

    body("description.*").trim().escape(),

    body("position.type").isEmpty(),

    ...vCoords("position.coordinates", false),

    body("position.address").trim().escape().not().isEmpty(),

    body("position.city").trim().escape().not().isEmpty(),

    body("date").not().isEmpty().isISO8601(),

    body("contacts").not().isEmpty(),

    oneOf([
        body("contacts.email").not().isEmpty().isEmail().normalizeEmail(),
        body("contacts.phone").not().isEmpty().isMobilePhone("any", { strictMode: true })
    ]),

    body("markedForDeletion").isEmpty()

];


// Validation chain for the body of the "patch" requests
export const patch = []; // ToDo
