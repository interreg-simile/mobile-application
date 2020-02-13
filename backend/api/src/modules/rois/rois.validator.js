/**
 * @fileoverview This file contains express-validator validation chains regarding the `rois` routes.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import { query } from "express-validator";
import yaml from "yamljs";
import path from "path";


// Load the configurations in JSON format
const conf = yaml.load(path.resolve("./config/models.yaml")).rois;


export const rois = [];
