/**
 * @fileoverview This file contains express-validator validation chains regarding the `rois` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { query, oneOf } from "express-validator";
import yaml from "yamljs";
import path from "path";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./config/models.yaml")).rois;


// Validation chain for the query parameters of the "get" route
export const getRois = [
    oneOf([
        [query("lat").isEmpty(), query("lon").isEmpty()],
        [query("lat").not().isEmpty().isFloat(), query("lon").not().isEmpty().isFloat()]
    ]),
    query("includeCoords").optional().isBoolean()
];
