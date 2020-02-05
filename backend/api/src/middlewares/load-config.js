/**
 * @fileoverview This file contains the logic needed to load the configuration files. It also check if an incoming
 * request corresponds to a valid combination of verb and route.
 *
 * @author Edoardo Pessina <edoardo.pessina@polimi.it>
 */

import path from "path";
import yaml from "yamljs";
import _ from "lodash";
import { match } from "path-to-regexp";

import constructError from "../utils/construct-error";


/** General configuration of the API. */
const generalConf   = yaml.load(path.resolve("./config/default.yaml"));

/** Configuration of the endpoints. */
const endpointsConf = yaml.load(path.resolve("./config/endpoints.yaml"));

/** App configuration. */
export const appConf = generalConf.app;

/** Version of the API in the format `v1`. */
export const version = `v${appConf.version}`;


/**
 * Loads the configuration of the incoming route.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
export default function (req, res, next) {

    // Save the base url of the request (e.g. event)
    const baseUrl = `/${req.path.split("/")[2]}`;

    // Save the path of the request (e.g. /eventId)
    const path = req.path.replace(`/${version}${baseUrl}`, "");

    // Find the first item that matches the path and the method
    const params = _.find(endpointsConf[baseUrl], i => match(i.path)(path) && i.method === req.method);

    // If no route is found throw an error
    if (!params) {
        next(constructError(404, "messages.routeNotFound"));
        return;
    }

    // Save the configuration in the request object
    req.config = params;

    // Call the next middleware
    next()

}
